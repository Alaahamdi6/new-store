OpenJML integration
===================

Quick notes to run OpenJML over this module.

Install OpenJML
- Download from https://openjml.org or install a system package so the `openjml` command is available.

Run via Maven
- From `elecstore` run:

```
mvn -Popenjml verify
```

This activates the `openjml` profile which runs the `openjml` executable (must be on PATH).

Run helper script (Windows PowerShell)
- From `elecstore` run:

```
.\scripts\run-openjml.ps1
```

If `openjml` is not on your PATH, install it first or run OpenJML manually against `src/main/java` files.
