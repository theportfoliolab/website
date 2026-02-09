import re
import sys

def main():
    # Read the regex pattern from the command line arguments
    if len(sys.argv) < 2:
        print("Usage: python matcher.py <regex>")
        sys.exit(1)

    pattern = sys.argv[1]

    # Compile the pattern string into a regex object
    # This lets us reuse the regex efficiently and call matching methods on it
    regex = re.compile(pattern)

    print(f"Using regex: {pattern}")
    print("Enter lines to test (Ctrl+C to quit):")

    # Repeatedly read input and test whether it belongs to the language
    # defined by the regex
    while True:
        try:
            line = input("> ")

            # fullmatch() succeeds only if the ENTIRE input string
            # matches the regex (not just a substring)
            if regex.fullmatch(line):
                print(f'"{line}" matches {pattern}')
            else:
                print(f'"{line}" does not match {pattern}')

        except KeyboardInterrupt:
            print("\nGoodbye!")
            break

# Only run main() if this file is executed directly
if __name__ == "__main__":
    main()