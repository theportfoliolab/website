# Author Voice Reference

This file is a working reference for the writing style used across ThePortfolioLab tutorials and articles. It is intended to be practical rather than rigid, so it should be updated as the site evolves.

## Purpose

Use this reference when drafting or revising tutorials and articles so the writing sounds like it belongs to the same publication, even when the topic changes.

## Core Voice

- Write in UK English, with the natural spelling conventions used in New Zealand and Australia.
- Prefer clear, connected prose over abrupt, clipped sentences.
- Aim for a practical, thoughtful tone rather than a corporate or overly polished one.
- Keep the writing direct, but not dry. There is usually a sense that the writer is thinking through the problem with the reader.
- Use a little personality where it helps, but avoid slang unless it is only a tiny touch of flavour.
- Avoid sounding like a product brochure, an academic journal, or a chat bot.

## Sentence Shape

- Prefer medium to long sentences when the ideas belong together.
- Let one sentence carry an idea through cause and effect, rather than breaking it into several short statements.
- Use connectives freely when they improve flow: `so`, `thus`, `because`, `which means`, `at this point`, `in practice`, `for example`.
- Short sentences are fine for emphasis, but they should feel deliberate rather than constant.

### Preferred

`This works, but it also exposes a limitation in the way the chart is currently structured, which is exactly the kind of thing we want to notice before we move on.`

### Avoid

`This works. It has a limitation. We will fix it next.`

## Punctuation

- Do not use em dashes.
- Prefer commas, full stops, parentheses, or a connective such as `and`, `but`, or `so`.
- Avoid semicolons unless they are genuinely the cleanest option.
- Colons are often useful when introducing a code block, a list, or a definition.

### Preferred

`The chart is useful, but it is still missing one important thing: a clearer way to compare the portfolio to the benchmark.`

### Avoid

`The chart is useful, but it is still missing one important thing -- a clearer way to compare the portfolio to the benchmark.`

## Spelling and Word Choice

- Prefer UK spellings:
  - `analyse`
  - `behaviour`
  - `colour`
  - `optimise`
  - `summarise`
  - `favourable`
- Prefer spaced compounds over hyphenated forms in normal prose:
  - `real world`, not `real-world`
  - `multi fund`, not `multi-fund`
  - `analysis ready`, not `analysis-ready`
  - `code block`, not `code-block`
  - `long term`, not `long-term`
- Keep technical terms correct where the code, library, or formal name requires a specific spelling.

## Tutorial Structure

- Open with scope and purpose before diving into steps.
- State why the next change matters, not only what the reader should type.
- Introduce code in a practical sequence, with each step building on the previous one.
- Use checkpoints and small verification steps so the reader can confirm progress before moving on.
- When the code grows, move responsibilities into helpers and explain why that keeps the project readable.
- Make it clear which file the reader should open, and where a change belongs.

## Code Instruction Rules

- Whenever asking the reader to add or replace code, name the file explicitly.
- If the code belongs inside an existing method, say which method it goes in and where it should be placed, for example after a loader call, before the charting section, or below an existing helper.
- If the step only changes imports, say so plainly and make it clear that the reader should only add imports that are missing.
- At larger turning points, tell the reader to remove imports that have become unused, so the import block does not quietly become messy.
- Do not include the `if __name__ == "__main__":` boilerplate in partial `main.py` snippets.
- If showing the full `main.py` file, include the boilerplate.

### Preferred

`Open main.py and add this helper below get_data(). Nothing else needs to change yet.`

`Still in main.py, inside main(), add this block after the data loading step and before the charting section.`

`At the top of reporting/outputs.py, add these imports only if they are not already present, and remove any old ones that are now unused.`

### Avoid

`Add this code.`

`Update your script like this.`

`Paste this into main.py somewhere near the top.`

### Preferred

`Open analytics/transforms.py and add the helper below the existing loader functions. The job of this helper is simple: it takes the downloaded price data and returns it in the same shape that the rest of the system already expects.`

### Avoid

`Add this helper.`

## Tutorial Explanations

- Explain code in terms of the system role it plays.
- Avoid line by line narration unless the code is especially dense.
- Focus on the important idea first, then the implementation detail.
- It is acceptable to tell the reader they do not need to understand every line yet, as long as the key takeaway is still made clear.

### Preferred

`You do not need to follow every line here in detail. The important point is that this helper now gives us the same input contract as Part 2, which means the rest of the workflow can stay almost unchanged.`

### Avoid

`This line creates a DataFrame. This line resets the index. This line returns it.`

## Finance Writing Patterns

- Keep the finance framing grounded and practical.
- Distinguish clearly between evidence and judgement.
- Avoid presenting one output as if it proves too much.
- Leave room for the reader to think before the tutorial reveals the next conclusion.
- Use mandate aware language when discussing portfolios.

### Preferred

`The tool gives us evidence, but it does not make the decision for us. We still need to interpret the results in the context of the portfolio's role, its benchmark, and the sort of risk the mandate is willing to tolerate.`

### Avoid

`The chart shows that this holding is bad and should be sold.`

## Headings and Leads

- Headings are usually plain and descriptive.
- A short lead is useful when it frames the purpose of the section.
- Headings should not feel too clever or overly dramatic.
- In tutorials, headings often follow the pattern of:
  - introducing a concept
  - making a structural change
  - running a test
  - reviewing the result

## Lists

- Use lists when they genuinely make the structure clearer.
- Keep bullets parallel in form where possible.
- Do not overuse lists for points that would read more naturally as connected prose.

## Preferred Tone Markers

These are recurring moves in the existing writing:

- `That is the gap we are going to close.`
- `This is exactly what we want.`
- `At this point, ...`
- `The important idea is ...`
- `In practice, ...`
- `That is enough for one tutorial part.`

## Open Questions

You can answer these later if you want the style guide to become more exact:

- When a tutorial step needs several import changes, do you prefer a dedicated short import clean up step, or should it be folded into the surrounding prose?
- When a partial `main.py` update is shown, do you prefer the lead to say `add`, `replace`, or `update`, or does that depend on the size of the change?
- When a code block is only a fragment of a method, do you want a short comment line in the prose describing what comes immediately before and after it?

Use these sparingly. They work because they sound deliberate, not because they appear everywhere.

## Revision Checklist

When revising a tutorial or article, check:

- Does the opening explain purpose and scope clearly?
- Are the steps introduced in the order a reader would actually need them?
- Is each code change placed in the right file, with that file named explicitly?
- Have clipped AI style sentences been merged into more natural connected prose?
- Have unnecessary hyphenated compounds been replaced in prose?
- Is the finance reasoning practical rather than overclaimed?
- Does the ending summarise what the reader built and what comes next?

## Example Rewrites

### Example 1

Avoid:

`Part 2 worked. It was basic. Now we improve it.`

Prefer:

`Part 2 worked, but only at a basic level, which means the next task is not to throw it away, but to refine it into something that is actually useful when the inputs stop being so clean.`

### Example 2

Avoid:

`Now add a helper.`

Prefer:

`Now add a helper in transforms.py so this data preparation step lives with the rest of the input logic instead of cluttering main().`

### Example 3

Avoid:

`The portfolio underperformed.`

Prefer:

`The portfolio lagged the benchmark over this window, which does not automatically mean the allocation is wrong, but it does give us a reason to look more closely at where the drag is coming from.`

## Notes and Additions

Add your own examples, favourite transitions, spelling preferences, and structural patterns here over time. This file is meant to become a living rulebook rather than a fixed prescription.

## Review Exercises

Use the sections below to refine the reference in your own words. You can either rewrite the examples, add notes beside them, or simply write `Good` if they already match your preference closely enough.

### 1. Intro Style Checks

Review each line and either rewrite it or mark it `Good`.

`In this part, we take the earlier workflow and apply it into a more realistic setting, so we can see if anything fails when we move outside the safety of our sample data.`

`We don't want to rebuild the project from scratch, but to highlight weaknesses by exposing it to a more realistic, larger scale task.`

Questions:

- Do you like introductions to sound deliberate and slightly formal, or a little more conversational?
- How much repetition of the previous tutorial do you usually want in the opening?

### 2. Explaining Code Changes

Review each line and either rewrite it or mark it `Good`.

`Add this helper to transforms.py so the data preparation stays with the rest of the input logic:`

`There's quite a lot of code here, but that key point is that this helper now gives us the same input shape that the system already expects.`

`At this point, main() should be doing very little beyond calling our helpers in the right order.`

Questions:

- When explaining a helper, do you prefer more emphasis on what it does, or why it belongs in that file?
- Do you like phrases such as `the key point is`, or do they feel too instructional?

### 3. Finance Framing

Review each line and either rewrite it or mark it `Good`.

`The tool gives us the evidence, but manual rebalancing of a portfolio still depends on judgement in relation to your goals. Given the same report, different mandates can result in different rebalancing action being taken.`

`If one holding shows weak performance in one test period, this doesn't mean we should lower it's weight, or sell it completely. Likewise, we shouldn't just maximise allocation to a strong holding. Portfolio construction is about role and purpose, as much as raw return.`

`This does not prove our rebalance was optimal, or that we could apply the same process to every portfolio and make a billion dollars, but it does show that our informed decision moved the portfolio in a positive direction.`

Questions:

- How cautious do you want the finance language to be?
- Do you prefer to sound a little sceptical by default when discussing results?

### 4. Reader Guidance

Review each line and either rewrite it or mark it `Good`.

`Open main.py and replace the old helper with the version below. Nothing else needs to change yet.`

`Before moving on, run the script and check that the output still looks sensible. This is the cleanest point to catch mistakes before the workflow grows again.`

`You do not need to understand every line here yet, but you should understand what role this helper plays in the system.`

Questions:

- How directive do you want tutorial instructions to be?
- Do you prefer frequent verification steps, or only at major checkpoints?

### 5. Closing Paragraph Style

Review each line and either rewrite it or mark it `Good`.

`At this stage, the system is doing the same core analysis as before, but now it produces a form that is much easier to inspect and discuss. These kinds of changes are what turns an MVP into something genuinely useful.`

`That is enough for now. We have not changed the portfolio yet, because our first job was to make sure that we could actually trust the reporting layer.`

`The next part shifts from monitoring to judgement. We should accept our system for what it is, and if we're not confident yet, we should go back, refactor, and test it more thoroughly so that we can make a sound interpretation.`

Questions:

- Do you like chapter endings to sound conclusive, or slightly open ended?
- Should the final paragraph usually point forward to the next article?

## Style Notes from Answers

These are the current preferences captured from your answers so far. They can be edited as needed.

- Longer sentences with multiple linked causes are preferred, because they tend to flow better, but a short punchy line is still useful when it emphasises a point or adds a little humour through delivery.
- The site should shift its voice by context: finance discussion can sound like an independent analyst, beginner tutorials should stay heavy on correct and accessible jargon, and more advanced tutorials should feel more like a one on one discussion with an experienced tutor.
- Personal opinion can appear when it helps justify a view or design choice without pretending to make a stronger claim than the evidence allows.
- Strong results should usually be presented with some scepticism or restraint, because the more important point is what the result actually means.
- Tutorial pacing should depend on the level. Early or beginner material can be more explicit, while later tutorials in a series can assume more background knowledge and move a little faster.
- Rhetorical questions are acceptable as a natural transition device, but they should be used by feel rather than by formula.

## Answered Preference Prompts

These keep your direct answers in their original form so they remain easy to review later.

### Preferred sentence rhythm

Prompt: Do you prefer sentences that build through multiple clauses, or do you want more variety with occasional short punchy lines?

Answer: Longer sentences with multiple causes are preferred, I feel that these flow better, but I'm not afraid to add a short punchy line if it emphasises a point, or adds humour through delivery.

### Preferred level of formality

Prompt: Should the site sound more like an independent analyst writing thoughtfully, or more like a teacher speaking directly to a beginner?

Answer: It should be a mix of both depending on the context: Financial discussion should reflect my own voice as an independent analyst, low tier tutorials should be heavy in correct, beginner friendly jargon with ample explanation when things aren't trivial, but more advanced tutorials should feel more like a one on one discussion with an experienced tutor, who understands your experience level and doesn't bog you down with excess detail.

### Preferred amount of personality

Prompt: How often should a personal line appear, such as `To me`, `I think`, or `Personally`?

Answer: I try to state personal opinion as frequently as is appropriate: Sometimes if I need to justify a decision on something without wanting to fully justify it with credible sources etc. then I will use a personal statement to do so.

### Preferred scepticism level

Prompt: When a result looks strong, should the prose usually temper it straight away, or only after the main point is made?

Answer: I like to present strong results with a level on cynicism. It's OK to be excited about a result, but it's more important to focus on what that result actually means.

### Preferred tutorial pacing

Prompt: Should steps be small and explicit, or slightly larger so the reader has to connect a few pieces themselves?

Answer: It depends on the level. Beginner tutorials or early tutorials in a series where foundational work is being done should have steps scaled with difficulty. I assume that by the time the reader has completed a few tutorials in a series, they themselves have enough understanding of what is going on, and don't need as many explanations or reminders about how things are working, especially if this detracts from the goals of that specific tutorial.

### Preferred use of rhetorical questions

Prompt: Do you like lines such as `So what does this mean?` or `Why does that matter?`, or would you rather keep those rare?

Answer: I might use rhetorical questions as a way to transition to a new section or idea, but I find this difficult to answer as it's not something that I explicitly consdier when writing. I just feel it out.

## Broader Voice Prompts

The earlier sections above are enough for tutorial specific review. The prompts below are for capturing general voice, sentence flow, and descriptive habits across a wider range of topics.

Write short answers, rough notes, or full rewrites. These do not need to be polished. The goal is to capture instinctive phrasing.

### Everyday Explanation Prompts

Answer these in your own words.

Prompt: Explain in steps how to fit a car tyre, assuming the reader is competent but inexperienced.

Your answer: I don't actually know how to fit a tyre, but I'll explain how I once changed a motorcycle tyre. After letting all the air out of the tyre, I used a rotary tool to cut through the tyre, all the way including the metal wires. I was very careful around the bead, and switched to side cutters to cut the thicker wires there without damaging the rim.
After all the wires were cut, the tyre could easily be peeled off. Then I put a bunch of strong zip ties around the new tyre, one every 2cm or so, but left them loose at this stage, as if they were tight they would interfere with me getting the first side of the tyre onto the rim. I used some glass cleaner as a lubricant, and positioned myself over the wheel. I worked first on getting one side of the tyre on, starting at one side and working around. As the tension on that bead increased, I switched to working
in smaller stages, alternating between sides of the unmounted section of the bead, until it finally slipped over. I now had one bead fully over the rim, and now I pulled all the zip ties tight. This pulled the beads inwards, expanding the unmounted side of the tyre, and I was able to force the remaining bead over the rim. It was still difficult and took a lot of force and a few attempts, but I finally got it over.
Then I cut and removed all the zip ties, careful not to damage anything with the cutters, and inflated the tyre. I was lucky because the bead took without much effort, and held air on the first try.

Prompt: What do you look for in a good fishing spot, and how would you explain that to someone who has never fished before?

Your answer: If I'm fishing from the rocks, I look for a spot that has a steep drop into the deepest possible water. I want to fish that deeper spot, where larger fish are less likely to get spooked by the waves. It being deep near that rock means that waves are shallower, so they don't crash as viiolently. This brings me to my next point: The spot needs to be safe. Think about what happens if you get knocked over, where will you fall, will it hurt if you fall? So the spot shouldn't be too precarious, or surrounded by things you could hit your head on, and the waves shouldn't be breaking with force over where you're trying to stand.
Those are the first 2 key aspects to consider: Prefer the deepest water, and safety. Then, look at things like rock formations and kelp. Avoid these: it doesn't matter how good a fishing spot looks from the surface, if all you're doing is getting snagged and replacing tackle, then you're spending less time with bait in the water. Try find clearings in the water where your bait can sit freely. A less obstructed spot, although theoretically less likely to harbour the big fish, will often produce better results by way of you keeping your bait on the hook and in the water for longer. You can also adjust your tackle and technique to better suit a spot, but that's not what we're talking about. 
If I'm fishing a beach or surfcasting, then it's a lot more simple: The goal is to get your bait as far from shore as possible. Find any elevation or better access via wading or other landscape features, make sure they give you stable footing for a strong cast, and send that bait out as far from the shore as you can. There's not much else fishing wise you can do in that scenario, so just focus on finding a place with a comfortable resting place like a ledge or tree branch to sit on.

Prompt: Describe what you see on your commute home, but write it the way you naturally would rather than trying to make it literary.

Your answer: It's not too far, I leave the carpark at the shops and pull out onto one of the feeder roads, which leads to the main road. I turn left at the lights, then right on <redacted> Ave, blast through the speed bumps as quickly as is safe, then turn on to <redacted>, try not to annoy the residents with my loud exhaust by keeping the engine load low, then one more turn onto my road. I go all the way to the end of the road and turn around in the cul de sac, so it's easier for me to park in my spot in front of the house.
Because my handbrake doesn't work well, I pull forwards into the space, then turn out so my car isn't pointing directly ahead at the car in front of me. That way, if I make a mistake, I'm not going to roll into my neigbours car. Then I carefully reverse into the spot, going back more than I need, so that I can get the car aligned with the footpath. I want to be close enough so that when I turn my wheels to the left, the left wheel butts up against the kurb.
After turning the wheels, I switch the ignition off, check that I'm in first gear, release the clutch, and slowly let go of the brakes. If I'm happy that the car is securely stopped against the kurb and the resistance of being in gear, then I'm done.

Prompt: Explain how you would choose a good place to stop on a road trip for lunch.

Your answer: Look for locals at the place, not tourists. Look for small menus, specialty dishes, and staff that look busy and a little stressed. If the ethnicity of the people running the store don't match the ethnicity of the food they're serving, that's a red flag. Except Koreans, who always seem to get it right.

Prompt: Describe how you decide whether a cafe feels worth returning to.

Your answer: If the food and service was good: To me, that means correct portion sizes, reasonable price based on quality not quantity, and the staff did or said nothing to offend. I don't need them to brown nose or try be my best friend, just don't interrupt my sentence when I'm talking with my company, and focus on the core aspects of service, not extra things like constant drink checks or small talk. I'm relatively easy to please when it comes to finding a place to eat, it just seems that so many places get it wrong.

### General Judgement Prompts

These help capture how you explain taste, standards, and criticism.

Prompt: What makes a design feel thoughtful rather than generic?

Your answer: One aspect is that every part of it serves a purpose. You never see a part and can't figure out why it's there or what it does. And it has to be complete: If you use something for a while and start feeling like it needs another feature, then it probably isn't very well thought out.

Prompt: What makes a room feel comfortable, even before you sit down in it?

Your answer: Appropriate lighting (I prefer incandescent lights but it's not a deal breaker), I don't want it too bright or too dark, but I'm more forgiving if a room is too dark vs too bright.

Prompt: If a product looks polished but seems badly designed underneath, how would you describe that difference?

Your answer: I like to think I can see right past superficial fit and finish. In things like furniture, I look at the materials, joinery, hardware etc. before I look at the piece as a whole. I generally find that good construction/manufacturing practices lead to both good design and good aesthetics. and cheaper manufacturing processes (even ones which produce "good" finishes like gloss paint or "plastic chrome") allow designers to cut the corners in design to produce a marketable product.
For example, a lot of people complain about BMW's engine design choices and say they are expensive to maintain and unreliable. But if you understand the design choices, your realise that while they do require more maintenance and aren't as simple as Japanese cars, you realise that not only you get so much more quality out of the correctly maintained BMW: It is a smooth, comfortable yet sporty, uncompromising ride. Whereas I find Japanese cars to be dull, lack connection, jerky, noisy, and have horribly stiff suspension, all as a result of decisions that make their cars more marketable to a general audience (a.k.a cheaper and more "accessible" driving experience). In addition, actually doing the maintenance tasks on an old BMW is easier then on Japanese cars, where the design ethos tends to be "It will never break so we don't need to worry about fixing it." The result is easier access to maintenance parts, with interfaces designed for mechanics to work on, instead of everything being tucked away in hard to reach places, or requiring half the car to be removed to get to one sensor. 
You could say I just value repairability more than reliability, but even if a part were reliable well beyond it's expected life cycle, why wouldn't you want it to be easier to replace?
So to more directly answer the question, the difference is in the fundamental choices that went in to the product's design, and how they relate to the use of that product, by people.

Prompt: What do you value in a website or publication layout?

Your answer: I don't want to answer this question as I don't know enough about evaluating website design to say anything worthwhile. But my gut feelings prefer clear text, content which provides enough context around the topic to understand it more broadly, and no sales pitches, ads, or feeling like I'm joining the author's cult.

### Finance and Investment Prompts

These are broader than the tutorial examples, but still close to the site's domain.

Prompt: Explain the difference between a good result and a good decision in investing.

Your answer: The result is what's measured: It's what you can qualify or quantify based on some kind of score or description, like 2% vs 3%, or lower/higher volatility (although in finance most things tend to be quantifiable). A good decision is one which best addresses as many of the reasons and problems for which a decision needs to be made in the first place. Say we need to choose a new stock to add to our portfolio: We must understand why this is. Are we seeking better returns, lower volatility, a broader asset base?
If we are looking for a broader asset base, and we already have a tech stock in the portfolio, then choosing to add another tech stock would be a poor decision. In the same scenario, choosing to add a stock mainly because of it's low volatility would be a poor decision: It doesn't address the asset base problem, it's trying to solve a different problem.

Prompt: What makes a portfolio feel overcomplicated?

Your answer: Complex or overbuilt decision criteria: A typical portfolio featuring diversification, broad asset classes, wide market exposure is in my opinion a method of long term investment, and shouldn't constantly be poked and prodded at. In the context of long term investment, if you were confident on your decision at inception, you'd better have a good reason to go back on it.
Thus, if you're constantly rotating securities, rebalancing, chasing different behaviour or regime exposure, you'd be better off using a more optimised tool that gives you more freedom. Portfolio then becomes a broad term to describe a series of holdings, but you could just have a series of holdings with no connection to each other in regard to selection or weighting, just other isolated reasons for buying them, if that's what you wanted to do.

Prompt: How would you explain diversification to someone who thinks it just means owning more things?

Your answer: That's partially right, but more importantly you own things with different behaviours.

Prompt: When does a benchmark become useful, and when can it become misleading?

Your answer: A benchmark is useful when you want to assess some aspect of one thing, when the decision to accept that thing has potential downsides or costs. An obvious example would be, why buy this high volatility "growth" fund, when the data shows it consistently underperforms a benchmark like SPY? By comparing to SPY, you can illustrate the idea that the high volatility fund only has downsides compared to a consistent baseline.

Prompt: What kinds of investment writing do you distrust on sight?

Your answer: Anything in advertisment, anything based on trending topics, anyone that strikes me as a "guru."

### Teaching and Explanation Prompts

These help pin down how you naturally guide a reader.

Prompt: When you explain something technical, how much do you like to simplify before you feel you are oversimplifying?

Your answer:

Prompt: What makes an example feel useful rather than contrived?

Your answer:

Prompt: If a reader is stuck, do you prefer to restate the concept, break it into steps, or give a new analogy?

Your answer:

Prompt: How do you usually decide whether a paragraph needs to be split in two?

Your answer:

### Short Rewrite Tasks on Broader Topics

Rewrite these in your own voice.

Task A:

`A good fishing spot is not only about where the fish are, but also about whether the conditions make it sensible to stay there for a while.`

Your version:

Task B:

`A room can look expensive and still feel unpleasant if the proportions, light, and materials are not working together.`

Your version:

Task C:

`A strong investment outcome does not necessarily prove the reasoning was sound: It could have simply been luck.`

Your version:

Task D:

`Instructions feel trustworthy when they tell you not only what to do, but also what should happen if you have done it correctly, and warns you about ways it could go wrong during the process.`

Your version:

### Mini Section Rewrite on a Neutral Topic

Rewrite this short section in your own style. You can change the wording, order, and sentence length, but keep the meaning.

Neutral section:

`A good commute is not necessarily the fastest one. Sometimes a slightly longer route is better because it is quieter, less frustrating, and gives you a more predictable trip. In practice, people often optimise for the wrong thing at first, because speed feels like the obvious metric, even when the overall experience is worse.`

Your rewrite:

## Focused Preference Checks

These are shorter, more open ended prompts aimed at the gaps that still seem ambiguous.

### Use of first person

Prompt: In tutorials and articles, when do you prefer `I` over `we`, if ever?

Answer:

### Use of mild humour

Prompt: Is mild humour welcome in tutorials, or should it mostly stay in articles and opinion pieces?

Answer:

### Repetition for clarity

Prompt: Do you prefer a small amount of repeated framing across sections, or should repetition be cut quite hard once the point has been made?

Answer:

### Density of theory

Prompt: In finance or design writing, should theory be woven lightly through the explanation, or broken out into its own dedicated paragraphs?

Answer:

### Tone when criticising something weak

Prompt: If a design, strategy, or claim is weak, should the prose sound measured, sceptical, or slightly sharp?

Answer:
