package electronics.elecstore.example;

/**
 * Minimal example showing a JML annotation that OpenJML can check.
 */
public class JmlExample {

    /*@ requires x >= 0; 
      @ ensures \result >= 0; 
      @*/
    public int absNonNegative(int x) {
        if (x < 0) return -x;
        return x;
    }

}
