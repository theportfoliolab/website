 import Body from "@/components/content/body"
import { Text } from "@/components/content/text.tsx"
import Link from "@/components/content/link.tsx";
import type { PostMeta } from "@/components/content/types"

// ─────────────────────────────────────────────
// Metadata (REQUIRED for routing)
// ─────────────────────────────────────────────
export const meta: PostMeta = {
    title: "Regular Expressions in Python: A Practical Introduction",
    description:
        "A practical introduction to regular expressions in Python, covering syntax, matching, grouping, quantifiers, and example code.",
    date: "2026-02-10",
    tags: ["python", "analysis", "regex"],
    type: "tutorial",
    slug: "python-regular-expressions-introduction",
    nextInSeriesSlug: "symbolic-encoding-financial-time-series",
}

// ─────────────────────────────────────────────
// Tutorial Component
// ─────────────────────────────────────────────
export default function Tutorial() {
    return (
        <Body>

            <Text
                heading="Introduction"
                content={`Regular expressions (shortened to regex) are a compact method of describing a pattern in a series of symbols. `}
            />

            <Text
                lead={`Regexes are defined by a set of rules called a syntax. Without a syntax, an expression is just an arbitrary string of symbols; it has no meaning. Therefore, we must formally define a syntax in order for our regexes to be well defined and unambiguous.`}
                content={`Without diving too deep into language theory, to use regex we should know how they are constructed, and what specifically we can and can't do with one particular syntax. This tutorial will cover the regex package included with Python, as follows:`}
            />

            <Text
                heading="Formal Definition and terminology"
                lead="The character alphabet"
                content={`The alphabet is all the characters which we can match against using a regex. In Python's regex package, the regex alphabet is the set of all Unicode characters, plus a set of special metacharacters used as operator symbols which define the language itself.`}
            />

            <Text
                lead="Included in the alphabet are:"
                bullets={["The Latin alphabet: a-z and A-Z", "Arabic numerals: 0, 1, 2, 3 ... 9", "Whitespace", "Accented characters: é, ö, ñ etc.", "Non-Latin characters, such as those from Greek or other scripts included in Unicode", "Emojis 😕"]}
            />

            <Text
                lead="Literals"
                content={`A literal is any symbol that matches itself: Essentially just any unique character in the specified 
                    alphabet. We know that 'a' matches 'a' because they are the same symbol: 
                    they look the same, so they must be the same. But 'a' does not match 'b', 
                    hopefully you can recognise that a and b are different symbols: They look different, 
                    so they are different. So 'A' is a literal, as is 'b', and so is every other 
                    non-metacharacter in our Unicode alphabet. Literals have no intrinsic meaning, 
                    they're just some 'thing'. They form the most basic of expressions: a is a regex which
                     accepts only the string 'a', b accepts only 'b'.`}
            />

            <Text
                lead="Concatenation"
                content={`We can put two expressions one after the other and they will be treated as a sequence, requiring all concatenated expressions to appear in the same order to match. Say we want to match an 'a', followed by a 'b', we just write the regex ab. The regex ab will match ab, but not ba, or aa, or bb.`}
            />


            <Text
                lead="Operators/Metacharacters"
                content={`Operators define things we can do with literals in a regex, like combining symbols, branching, or finding some number of occurrences of a literal. The metacharacters defined in the Python re package are:`}
                code={`"[]", "\\", ".", "^", "$", "*", "+", "?", "{}", "|", "()"`}
            />



            <Text          
                lead="[ ] : A set of characters"
                content={`We can specify a set of characters to be checked, meaning if exactly one of the characters in that set match the target character, then they will match. For example, [a-e] says that we can match a, b, c, d, or e: [a-e] matches b, but not f. Note that [ab] does not match 'ab', but does match 'a' and 'b'.`}
            />

            <Text
                lead="\ : Escape character and special sequences"
                content={`The backslash \\ is used to give special meaning to the character that follows it.
                    Most commonly, it is used to escape metacharacters so they are treated as literals.
                    For example, \\* matches the literal character '*', rather than acting as a repetition operator.

                    The backslash is also used to introduce special character sequences such as \\d (digit), \\w (word character), and \\s (whitespace), which match predefined sets of characters.`}
            />


            <Text
                lead="^ : Starts with"
                content={`If the expression following ^ matches at the start of the target string, then the regex will match.
                    ^ab will match ab, abc, and abz, but not ba or bab.`}
            />


            <Text
                lead="$ : Ends with"
                content={`Similar to ^ (starts with), if the expression preceding $ is found at the end of the target string, then it is accepted. ab$ will accept ab, cab, efgab, but not abc or abb.`}
            />

            <Text
                lead="The quantifiers: match some number of a symbol repeated"
            />

            <Text
                lead="* : Zero or more occurrences"
                content={`If the expression preceding * appears 0 or more times, the string is accepted. a* accepts 'a', 'aa', 'aaa' and also the empty string ''.`}
            />

            <Text
                lead="+ : One or more occurrences"
                content={`Similar to *, except the specified expression must appear at least once to be accepted. a+ accepts 'a', 'aa', 'aaa", but not the empty string ''.`}
            />

            <Text
                lead="? : Zero or one occurrence"
                content={`The specified expression can only appear one time (or not at all) in the target string to be accepted. a? accepts '', 'a', but not 'aa'`}
            />

            <Text
                lead="{n} : Exactly n occurrences"
                content={`The specified expression must appear exactly n times to be accepted. a{2} accepts 'aa', but not 'aaa'`}
            />

            <Text
                lead="Remember, the quantifiers *, +, ? and {n} work on the expression to their left."
            />

            <Text
                lead="| : Either Or"
                content={"| specifies alternation. The expressions directly left or right of | can appear at that position in the target string and still be accepted. a|b accepts both 'a' and 'b'."}
            />

            <Text
                heading="The final operator, and precedence in regexes"
                lead="( ) : Capture or group"
                content={`This is used to control precedence. A group placed inside the brackets is treated as isolated from any preceding or following expressions, just like the brackets in arithmetic. (abc) accepts 'abc' but not 'a', 'ab', or 'cba'.`}
            />

            <Text
                lead="So we know how the operators work in isolation, but how do we combine them and ensure we get our desired language?"
                content={`When multiple operators appear in a regex, the order in which they are applied can change which strings the expression matches. Some operations are more tightly bound than others, so we need to be 
                    careful with how we construct regexes to achieve the desired outcome.
                    Grouping ( ) can override any precedence, allowing binding of complex regex elements.
                    Quantifiers ( *, +, ? and {n} ) are tightly bound to their preceding expression, and concatenation has the next highest precedence.
                    Alternation ( | ) has lower precedence than concatenation. 
                    Understanding operator precedence is essential to combine regex elements correctly and create the exact language you intend. `}
            />

            <Text
                lead="A Simple Example with Concatenation and Multiple Alternations:"
                content={`Let's look at the regex ab|a|c.  
            Reading left to right, we have 'a' concatenated with 'b', followed by alternation with just 'a', then alternation with 'c'.  

            Remember that concatenation has higher precedence than alternation. This means that the left side of the first | matches 'ab', not just 'b'. The second option matches 'a' on its own. Finally, the third option matches 'c'.`}
            />

            <Text
                content={`So the language of the regex ab|a|c is {a, ab, c}.  
            We can have 'a' on its own because it is explicitly specified as a separate option in the alternation. We cannot have just 'b' because concatenation binds 'a' and 'b' together into 'ab'.  

            Note that in this case, the order of the alternatives does not affect the language: ab|a|c is equivalent to c|ab|a or any other permutation of the expressions ab, a, and c.`}
            />

            <Text
                lead="A More Complex Example: Natural Language Sentences"
                content={`Let's create a regex to generates simple sentences, like:`}

                bullets={["Dogs are fluffy",
                "Cats are cute" ,
                "Dogs are fluffy and cute",
                "Cats are cute and fluffy" ]
                }
            />

            <Text
                lead="We can write a regex for this as follows:"
                code={`(Dogs|Cats) are (really )*(fluffy( and cute)?|cute( and fluffy)?)`}
            />

            <Text
                content={`Here's what each part does:`}

                bullets={[
                    '(Dogs|Cats) selects either "Dogs" or "Cats".',
                    'are is the literal word "are" (in standard English we would always use this word here).',
                    '(really )* allows zero or more repetitions of "really " - we might repeat "really" to emphasise how cute or fluffy the pet is.',
                    '(fluffy( and cute)?|cute( and fluffy)?) lets us say they are fluffy, cute, or both. By fixing the order of the second adjective, we avoid sentences like "fluffy and fluffy" or "cute and cute". The ? makes the second adjective optional, so the sentence may end after the first adjective.'
                ]}
            />

            <Text
                lead="Example Sentences Using This Regex:"
                bullets={[
                    '"Dogs are fluffy"',
                    '"Cats are cute"',
                    '"Dogs are really really fluffy and cute"',
                    '"Cats are really cute and fluffy"'
                ]}
            />

            <Text
                lead="Sentences This Regex Does Not Match:"
                bullets={[
                    '"Dogs are fluffy and fluffy"',
                    '"Cats are not cute or fluffy"'
                ]}
            />

            <Text
                content={`By explicitly listing the allowed second adjective for each case, 
                we prevent repeated adjectives without using advanced regex features
                 like negative lookahead. This demonstrates how alternation
                  ( | ), grouping ( ), and quantifiers (*) work together to define the language precisely.`}
            />

            <Text
                heading="Using Python's re package: Example code"
                lead={"Here is a quick example to help you explore regexes in a simple console app."}

                code={`
import re # The regular expression package
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
            print("\\nGoodbye!")
            break

# Only run main() if this file is executed directly
if __name__ == "__main__":
main()`}
            />

            <Text
                lead="Other Useful Regex Methods in Python"
                content={`In the previous example, we used fullmatch() to check whether an entire input string matches the regex. 
    Python's regex objects provide several other useful methods, depending on how strict you want the matching to be:`}
            />

            <Text
                bullets={[
                    'search(string): Checks whether the regex appears anywhere inside the string. This is useful when you only care if a pattern occurs as a substring.',
                    'match(string): Checks whether the regex matches starting at the beginning of the string, but does not require the entire string to match.',
                    'findall(string): Returns a list of all substrings that match the regex, which is useful for extracting information from text.',
                    'sub(replacement, string): Replaces all matches of the regex with a given replacement string, commonly used for cleaning or transforming text.'
                ]}
            />

            <Text
                lead="Try This: Changing How Strict the Matcher Is"
                content={`You can easily experiment with different regex methods by modifying a single line in the matcher program.

    First, locate line 27 in the example code:`}
            />

            <Text
                code={`if regex.fullmatch(line):`}
            />

            <Text
                content={`This line requires the entire input string to match the regex exactly.

    Now try replacing fullmatch() with search():`}
            />

            <Text
                code={`if regex.search(line):`}
            />

            <Text
                content={`Run the program again using the same regex. You’ll notice that inputs which merely contain a matching substring are now accepted.

    This small change has a big effect: instead of requiring the entire string to belong to the language defined by the regex, we now accept any string that contains a word or phrase from that language.`}
            />


            <Text
                lead="More Information"
                content={
                    <>
                        For more examples and detailed explanations of Python&apos;s regex features, see the Python regular expressions tutorial on{" "}
                        <Link href="https://www.w3schools.com/python/python_regex.asp">W3Schools</Link>
                    </>
                }
            />

            <Text
                heading="Summary"
                content={`Regex lets you describe patterns in text precisely and compactly. 
    By mastering literals, concatenation, alternation, quantifiers, and grouping, 
    you can extract exactly what you want from messy text, validate inputs, or detect patterns in data.`}
            />

            <Text
                lead="Applications in Data Analysis and Trading"
                bullets={[
                    "Parsing financial news to detect sentiment or price-moving keywords.",
                    "Extracting ticker symbols, dates, or numeric values from reports automatically.",
                    "Filtering chat messages or logs for trading signals or alerts.",
                    "Detecting anomalies in transaction records or market feeds.",
                    "Cleaning and standardizing large datasets for machine learning or backtesting."
                ]}
            />

            <Text
                content={`Regex is a powerful tool for quants, data scientists, and analysts. 
    Even in a world dominated by numbers, the ability to quickly parse, clean, and extract text can unlock insights and automate tasks that would otherwise take hours.`}
            />



        </Body>
    )
}
