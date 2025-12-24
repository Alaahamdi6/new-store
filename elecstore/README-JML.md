OpenJML Integration (JML Formal Verification)
==============================================

This project uses **OpenJML 21-0.19** for formal verification of Java code using the Java Modeling Language (JML).

## Prerequisites

1. **Java JDK 21** - Required by OpenJML and Maven
   - Download: https://adoptium.net/latest.html?variant=openjdk21
   - Set `JAVA_HOME` environment variable

2. **WSL 2 (Ubuntu 22.04)** - Recommended for Windows users
   - OpenJML has better support on Linux
   - Download: `openjml-ubuntu-22.04-21-0.19.zip` from https://www.openjml.org/downloads/

## Setup (Windows with WSL)

```bash
# In WSL Ubuntu 22.04 terminal
mkdir -p ~/openjml
cd ~/openjml
unzip /mnt/c/Users/YOUR_USERNAME/Desktop/openjml-ubuntu-22.04-21-0.19.zip

# Optionally add to ~/.bashrc:
export PATH=~/openjml:$PATH
```

## Running OpenJML

### Option 1: Direct command in WSL
```bash
cd /mnt/c/Users/YOUR_USERNAME/Desktop/alaa2/alaa2/elecstore
~/openjml/openjml -d target/classes src/main/java/electronics/elecstore/example/JmlExample.java
```

### Option 2: Via Maven Wrapper (with Maven profile)
```bash
cd elecstore
./mvnw -Popenjml verify
```

### Option 3: PowerShell helper script
```powershell
.\scripts\run-openjml.ps1
```

## Example JML Annotations

See [src/main/java/electronics/elecstore/example/JmlExample.java](src/main/java/electronics/elecstore/example/JmlExample.java) for a minimal JML example:

```java
/*@ requires x >= 0; 
  @ ensures \result >= 0; 
  @*/
public int absNonNegative(int x) {
    if (x < 0) return -x;
    return x;
}
```

- `@requires` - precondition
- `@ensures` - postcondition
- `\result` - return value

## Notes

- OpenJML performs **static verification** of JML annotations
- Basic compilation check works out-of-box
- Extended Static Checking (`-esc`) requires z3 solver (may have platform limitations)
- Add JML specs to your business logic classes to increase confidence in correctness
