#!/usr/bin/env python3
"""Generate the Spanish and English pedagogical content packs.

The source of truth remains the Portuguese seed content in the sibling API
project. Translations are produced locally with Argos Translate so no course
material is sent to an external service.

Usage (after installing Argos and the pt->es / pt->en language packages):
    python scripts/generate-content-translations.py
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any, Iterable

from argostranslate import translate


WEB_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = WEB_ROOT.parent / "portal-defesa-civil-api" / "prisma" / "seed" / "data"
CONTENT_ROOT = DATA_ROOT / "content"
DEFAULT_OUTPUT_ROOT = WEB_ROOT / "public" / "locales"

JSON_FILES = (
    "decks.json",
    "aula1-decks.json",
    "aula2-decks.json",
    "questoes.json",
    "aula1-questoes.json",
    "aula2-questoes.json",
)

STATIC_CONTENT = (
    "Programa de evolução contínua LGND SQUAD",
    "Aula 1 — BREC e NOS",
    "Aula 2 — Águas rápidas e corretezas",
    "Núcleo Pareto 80/20",
    "Resumo por módulo · M1 a M6",
    "Síntese da apostila · Módulos 01 a 08",
    "Glossário, siglas e linha do tempo",
    "Apostila · M01 Introdução",
    "Apostila · M02 PNPDEC",
    "Apostila · M03 Riscos",
    "Apostila · M04 Prevenção e mitigação",
    "Apostila · M05 Preparação e planejamento",
    "Apostila · M06 Resposta",
    "Apostila · M07 Recuperação",
    "Apostila · M08 Ética e liderança",
    "Aula 1 · BREC e NOS",
    "Aula 2 · Águas rápidas",
    "Cartas essenciais",
    "Cartas de prova",
    "Essenciais · 80/20",
    (
        "FIRE Experience: noções de BREC e NOS para a Brigada de Resgate. "
        "Regra zero, 7 nós, 3 pontos, apito, chamada 360° e croqui."
    ),
    (
        "Táticas de águas rápidas: pirâmide resgatista-equipe-vítima, EPI, "
        "3 km/h, strainer, remanso, 45°, throw bag e choque térmico."
    ),
)

PROTECTED_PATTERN = re.compile(
    r"^#{1,6}\s+"
    r"|^\s*(?:[-+*]|\d+\.)\s+"
    r"|^\s*>\s+"
    r"|```.*?```"
    r"|`[^`\n]+`"
    r"|\*\*|__|(?<!\*)\*(?!\*)"
    r"|[|×÷=→←]"
    r"|Estevão Marques|LGND SQUAD|FIRE Experience"
    r"|<[^>\n]+>"
    r"|https?://[^\s)<]+"
    r"|(?<=\]\()[^)\n]+(?=\))"
    r"|&(?:[a-zA-Z]+|#\d+);",
    re.DOTALL,
)
TABLE_SEPARATOR_PATTERN = re.compile(r"^\s*\|?[\s:|-]+\|?\s*$")
MODULE_PATTERN = re.compile(r"^MÓDULO\s+(\d+)\s+—\s+(.+)$")
QUIZ_PATTERN = re.compile(r"^Quiz\s+(\d+)\.(\d+)\s+—\s+(.+)$")

TRANSLATION_OVERRIDES: dict[str, dict[str, str]] = {
    "Nós e amarrações": {"en": "Knots and lashings", "es": "Nudos y amarres"},
    "Aula 1 — BREC e NOS": {"en": "Lesson 1 — BREC and KNOTS", "es": "Clase 1 — BREC y NUDOS"},
    "Aula 1 · BREC e NOS": {"en": "Lesson 1 · BREC and KNOTS", "es": "Clase 1 · BREC y NUDOS"},
    "mais uma vítima": {"en": "another victim", "es": "una víctima más"},
    "Croqui do sinistro": {"en": "Incident sketch", "es": "Croquis del incidente"},
}

# Corrections for rescue vocabulary that the compact offline models tend to
# leave in Portuguese or interpret in a non-technical sense.
POST_REPLACEMENTS: dict[str, tuple[tuple[str, str], ...]] = {
    "es": (
        ("Nosotros y amarraciones", "Nudos y amarres"),
        ("Todo nodo", "Todo nudo"),
        ("Nó conferido", "Nudo comprobado"),
        ("Nó seguro", "Nudo seguro"),
        (
            "Nudo comprobado es nodo seguro: ejecutó, lo acomodó (sin cruces), apretó y confirió en voz alta con el compañero.",
            "Un nudo comprobado es un nudo seguro: ejecútelo, acomódelo (sin cruces), apriételo y compruébelo en voz alta con su compañero.",
        ),
        ("| Nó |", "| Nudo |"),
        ("arrumou", "lo acomodó"),
        ("cruzes", "cruces"),
        ("conferiu", "comprobó"),
        ("Travar con medio-no", "Bloquear con medio nudo"),
        ("Lais de guía", "As de guía"),
        ("¡Alza que no corre!", "Gaza fija que no corre"),
        ("Alça en medio", "Gaza en medio"),
        ("Chicote de al menos un palmo", "Extremo libre de al menos un palmo"),
        ("Azelha", "Gaza simple"),
        ("Alza rápida", "Gaza rápida"),
        ("mosquetán", "mosquetón"),
        ("trabamento", "bloqueo"),
        ("Cadeirinha rápida", "Silla rápida"),
        ("Conferir antes", "Comprobar antes"),
        ("Poeirada", "Polvo"),
        ("bajo laje", "bajo la losa"),
        ("ferraje", "armadura"),
        ("estalo", "crujido"),
        ("Sin apito", "Sin silbato"),
        ("silvos", "pitidos"),
        ("silvo", "pitido"),
        ("vasculhada", "inspeccionada"),
        ("Croqui", "Croquis"),
        ("croqui", "croquis"),
        ("acidenta", "accidenta"),
        ("Busca y Rescate", "Búsqueda y Rescate"),
        (" · segunda ", " · lunes "),
        (" → 4 conferir", " → 4 comprobar"),
        (" / pare", " / deténgase"),
        ("| Fiel |", "| Ballestrinque |"),
        ("| Ocho |", "| Nudo ocho |"),
        ("| Derecho |", "| Nudo llano |"),
    ),
    "en": (
        ("Nodes and moorings", "Knots and lashings"),
        ("Cricket of the sinister", "Incident sketch"),
        ("cricket of the sinister", "incident sketch"),
        ("a <strong>another victim</strong>", "<strong>another victim</strong>"),
        ("Not Disaster Operator", "Does not qualify anyone as a Disaster Operator"),
        ("official body", "official authority"),
        (
            "The knot is secure: it executed, fixed (without crosses), pressed and checked aloud with the partner.",
            "A checked knot is a safe knot: tie it, dress it (without crossings), tighten it, and cross-check it aloud with your partner.",
        ),
        ("Under stress only comes what has become automatic.", "Under stress, only trained automatic responses surface."),
        ("1 execute → 2 fix → 3 Squeeze → Four check", "1 tie → 2 dress → 3 tighten → 4 check"),
        ("| Node | Serves for | Warning |", "| Knot | Used for | Caution |"),
        ("| Faithful | Fix rope to fixed point | Lock with half-node |", "| Clove hitch | Secure rope to a fixed point | Lock with a half hitch |"),
        ("| Guide lais | A handle that doesn't run | Whip of at least one palm |", "| Bowline | Fixed loop that does not slip | Working end at least one handspan long |"),
        ("| Olives | Quick handle for musket | Hard to undo after load |", "| Overhand loop | Quick loop for a carabiner | Hard to untie after loading |"),
        ("| Eight | Connection most used in the rescue | Clean design without cross |", "| Figure eight | Most-used rescue connection | Clean shape, without crossings |"),
        ("| Carioca | Handle in the middle of the rope | Multiple points on the same line |", "| Carioca knot | Loop in the middle of the rope | Multiple points on the same line |"),
        ("| Right | Join two equal ropes, light load | No load of life without locking |", "| Square knot | Join equal ropes for light loads | Not for life-safety loads unless backed up |"),
        ("| Quick notebook | Improvised seat | Check before lifting |", "| Emergency harness | Improvised seat harness | Check before lifting |"),
        ("## 2. Displacement in collapsed area", "## 2. Movement through a collapsed area"),
        (
            "Dusty, empty under slab, hardware, gas smell and snap are order of retreat.",
            "Dust, voids beneath slabs, exposed rebar, gas odors, and cracking sounds are signals to retreat.",
        ),
    ),
}


def read_json(name: str) -> Any:
    return json.loads((DATA_ROOT / name).read_text(encoding="utf-8"))


def add(values: set[str], value: Any) -> None:
    if isinstance(value, str) and value.strip():
        values.add(value)


def card_back(card: dict[str, Any], kind: str) -> str:
    if kind != "EXAM":
        return card["v"]
    context_parts = []
    for value in (card.get("mod"), card.get("quiz")):
        if value:
            context_parts.append(re.sub(r"^MÓDULO\s+", "Módulo ", value))
    context = " · ".join(context_parts)
    if not context:
        return card["v"]
    return f'{card["v"]}\n\n*Contexto para revisão inversa: {context}.*'


def collect_decks(values: set[str], payload: dict[str, Any]) -> None:
    for key, kind in (("p", "ESSENTIAL"), ("q", "EXAM")):
        for card in payload.get(key, []):
            for field in ("f", "v", "t", "a"):
                add(values, card.get(field))
            add(values, card_back(card, kind))
            for link in card.get("s", []):
                if link:
                    add(values, link[0])


def collect_questions(values: set[str], payload: list[dict[str, Any]]) -> None:
    for question in payload:
        module = question["mod"]
        quiz = question["quiz"]
        for field in (module, quiz, question["q"], question.get("com", "")):
            add(values, field)
        for option in question["opts"]:
            add(values, option)
        add(values, f"{module} › {quiz}")

        module_match = MODULE_PATTERN.match(module.strip())
        quiz_match = QUIZ_PATTERN.match(quiz.strip())
        if module_match:
            add(values, module_match.group(2))
        if quiz_match:
            add(values, quiz_match.group(3))


def extract_module_summaries(source: str) -> Iterable[str]:
    for part in re.split(r"^## ", source, flags=re.MULTILINE)[1:]:
        heading = part.split("\n", 1)[0].strip()
        if re.match(r"^M\d+\b", heading):
            yield f"## {part.strip()}"


def collect_source_strings() -> set[str]:
    if not DATA_ROOT.is_dir():
        raise FileNotFoundError(f"Seed data directory not found: {DATA_ROOT}")

    values = set(STATIC_CONTENT)
    for name in JSON_FILES:
        payload = read_json(name)
        if "decks" in name:
            collect_decks(values, payload)
        else:
            collect_questions(values, payload)

    for path in sorted(CONTENT_ROOT.glob("*.md")):
        add(values, path.read_text(encoding="utf-8"))

    modules_source = (CONTENT_ROOT / "02_modulos_plataforma.md").read_text(encoding="utf-8")
    for summary in extract_module_summaries(modules_source):
        add(values, summary)
    return values


def should_translate(line: str) -> bool:
    return bool(re.search(r"[A-Za-zÀ-ÖØ-öø-ÿ]", line)) and not TABLE_SEPARATOR_PATTERN.match(line)


def translate_fragment(fragment: str, locale: str, fragment_cache: dict[str, str]) -> str:
    whitespace = re.match(r"^(\s*)(.*?)(\s*)$", fragment, flags=re.DOTALL)
    if not whitespace:
        return fragment
    leading, core, trailing = whitespace.groups()
    if not should_translate(core):
        return fragment
    if core not in fragment_cache:
        override = TRANSLATION_OVERRIDES.get(core, {}).get(locale)
        if override:
            fragment_cache[core] = override
        else:
            fragment_cache[core] = translate.translate(core, "pt", locale)
    return f"{leading}{fragment_cache[core]}{trailing}"


def translate_line(
    line: str,
    locale: str,
    line_cache: dict[str, str],
    fragment_cache: dict[str, str],
) -> str:
    if not should_translate(line):
        return line
    if line in line_cache:
        return line_cache[line]

    translated_parts: list[str] = []
    cursor = 0
    for match in PROTECTED_PATTERN.finditer(line):
        translated_parts.append(
            translate_fragment(line[cursor : match.start()], locale, fragment_cache)
        )
        translated_parts.append(match.group(0))
        cursor = match.end()
    translated_parts.append(translate_fragment(line[cursor:], locale, fragment_cache))
    line_cache[line] = "".join(translated_parts)
    return line_cache[line]


def translate_rich_text(
    source: str,
    locale: str,
    line_cache: dict[str, str],
    fragment_cache: dict[str, str],
) -> str:
    translated_lines: list[str] = []
    in_fence = False
    for raw_line in source.splitlines(keepends=True):
        newline = "\n" if raw_line.endswith("\n") else ""
        line = raw_line[:-1] if newline else raw_line
        if line.lstrip().startswith("```"):
            translated_lines.append(line + newline)
            in_fence = not in_fence
            continue
        translated_lines.append(
            (
                line
                if in_fence
                else translate_line(line, locale, line_cache, fragment_cache)
            )
            + newline
        )
    return postprocess_translation("".join(translated_lines), locale)


def postprocess_translation(translated: str, locale: str) -> str:
    for source, replacement in POST_REPLACEMENTS[locale]:
        translated = translated.replace(source, replacement)
    return translated


def validate_pack(source_values: set[str], output: dict[str, str]) -> None:
    missing = source_values.difference(output)
    if missing:
        raise ValueError(f"Translation pack is missing {len(missing)} source strings")
    empty = [source for source, translated in output.items() if not translated.strip()]
    if empty:
        raise ValueError(f"Translation pack contains {len(empty)} empty translations")
    for source, translated in output.items():
        if source.count("\n") != translated.count("\n"):
            raise ValueError(f"Line structure changed for: {source[:120]!r}")
        source_tokens = PROTECTED_PATTERN.findall(source)
        translated_tokens = PROTECTED_PATTERN.findall(translated)
        if source_tokens != translated_tokens:
            raise ValueError(f"Protected markup changed for: {source[:120]!r}")


def generate(locale: str, source_values: set[str], output_root: Path) -> Path:
    ordered = sorted(source_values)
    target_dir = output_root / locale
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / "content.json"
    partial = target_dir / ".content.partial.json"
    output: dict[str, str] = (
        json.loads(partial.read_text(encoding="utf-8")) if partial.exists() else {}
    )
    output = {source: translated for source, translated in output.items() if source in source_values}
    line_cache: dict[str, str] = {
        source: translated for source, translated in output.items() if "\n" not in source
    }
    fragment_cache: dict[str, str] = {}
    total = len(ordered)
    for index, source in enumerate(ordered, start=1):
        if source not in output:
            output[source] = translate_rich_text(source, locale, line_cache, fragment_cache)
        if index % 25 == 0:
            partial.write_text(
                json.dumps(output, ensure_ascii=False, sort_keys=True), encoding="utf-8"
            )
        if index % 100 == 0 or index == total:
            print(f"[{locale}] {index}/{total}", flush=True)

    validate_pack(source_values, output)
    target.write_text(
        json.dumps(output, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    if partial.exists():
        partial.unlink()
    return target


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", choices=("es", "en"), default=("es", "en"))
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    args = parser.parse_args()

    source_values = collect_source_strings()
    print(f"Collected {len(source_values)} unique pedagogical strings", flush=True)
    for locale in args.locales:
        target = generate(locale, source_values, args.output_root)
        print(f"Wrote {target}", flush=True)


if __name__ == "__main__":
    main()
