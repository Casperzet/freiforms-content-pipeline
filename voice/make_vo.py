"""Generate voiceover per reel from scripts.json with Piper (German, Thorsten, CC0).
Writes vo-<reel>.wav and timing-<reel>.json (start/end of every line, total duration)."""
import json, subprocess, sys, os, wave

HERE = os.path.dirname(os.path.abspath(__file__))
PIPER = os.path.join(HERE, "venv", "bin", "piper")
MODEL = os.path.join(HERE, "de_DE-thorsten-high.onnx")
LEAD = 0.25      # silence before the first line
GAP = 0.35       # pause between lines
TAIL = 1.6       # time after the last line (end card)
SPEED = 0.92     # <1 = faster speech


def dur(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()


VOICES = {"de": ("de_DE-thorsten-high", None), "en": ("en_US-joe-medium", None),
          "ru": ("ru_RU-dmitri-medium", None), "uk": ("uk_UA-ukrainian_tts-medium", "mykyta")}


def main(reels, lang="de"):
    global MODEL
    model, speaker = VOICES[lang]
    MODEL = os.path.join(HERE, model + ".onnx")
    spk = []
    if speaker:
        cfg = json.load(open(MODEL + ".json", encoding="utf-8")); spk = ["--speaker", str(cfg["speaker_id_map"][speaker])]
    if lang == "de":
        scripts = json.load(open(os.path.join(HERE, "scripts.json"), encoding="utf-8"))
    else:
        scripts = json.load(open(os.path.join(HERE, "scripts_i18n.json"), encoding="utf-8"))[lang]
    sfx = "" if lang == "de" else f"-{lang}"
    for r in reels:
        parts, timing, t = [], [], LEAD
        for i, ln in enumerate(scripts[r]["lines"]):
            out = os.path.join(HERE, f"_{r}_{i}.wav")
            subprocess.run([PIPER, "-m", MODEL, "-f", out, "--length-scale", str(SPEED), *spk],
                           input=ln["text"].encode("utf-8"), check=True, capture_output=True)
            d = dur(out)
            timing.append({**ln, "start": round(t, 3), "end": round(t + d, 3)})
            parts.append((out, t))
            t += d + GAP
        total = round(t - GAP + TAIL, 3)
        # mix all lines at their offsets into one track (mono 22.05 kHz -> stereo 48 kHz, light compression)
        inputs, filters = [], []
        for k, (p, off) in enumerate(parts):
            inputs += ["-i", p]
            filters.append(f"[{k}:a]adelay={int(off * 1000)}|{int(off * 1000)}[d{k}]")
        mix = "".join(f"[d{k}]" for k in range(len(parts)))
        filters.append(f"{mix}amix=inputs={len(parts)}:normalize=0,aresample=48000,"
                       f"acompressor=threshold=-18dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5:LRA=7,"
                       f"apad=whole_dur={total}[out]")
        wav = os.path.join(HERE, f"vo{sfx}-{r}.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(filters),
                        "-map", "[out]", "-ac", "2", "-t", str(total), wav], check=True)
        json.dump({"reel": r, "lang": lang, "title": scripts[r]["title"], "duration": total, "lines": timing},
                  open(os.path.join(HERE, f"timing{sfx}-{r}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        for p, _ in parts:
            os.remove(p)
        print(lang, r, "duration", total, "s;", " | ".join(f'{x["beat"]} {x["start"]}-{x["end"]}' for x in timing))


if __name__ == "__main__":
    lang = os.environ.get("LANG_VO", "de")
    main(sys.argv[1:] or ["a", "b", "c"], lang)
