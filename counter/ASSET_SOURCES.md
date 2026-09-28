# Sprite sources

The nine transparent 96×96 PNG front sprites are copied without editing from the [PokéAPI sprites repository](https://github.com/PokeAPI/sprites), `sprites/pokemon/{id}.png`:

| Display order | Pokémon | National Dex ID |
| --- | --- | ---: |
| 1 | Dragonite | 149 |
| 2 | Rillaboom | 812 |
| 3 | Volcarona | 637 |
| 4 | Gengar | 94 |
| 5 | Incineroar | 727 |
| 6 | Bulbasaur | 1 |
| 7 | Charmander | 4 |
| 8 | Squirtle | 7 |
| 9 | Pikachu | 25 |

The PNG files are stored in `assets/pokemon/` and embedded into the generated SVG as data URIs; visitors do not load nine external sprite URLs. [PokéAPI's license file](https://github.com/PokeAPI/sprites/blob/master/LICENCE.txt) states that image contents are copyrighted by The Pokémon Company. This is an unofficial fan-made profile display.
