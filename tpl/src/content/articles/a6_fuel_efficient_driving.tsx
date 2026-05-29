import Body from "@/components/content/body"
import ImageBlock from "@/components/content/imageblock"
import Link from "@/components/content/link"
import Disclaimer from "@/components/content/disclaimer"
import { Text } from "@/components/content/text"
import type { PostMeta } from "@/components/content/types"

import car_photo from "@/content/articles/a6_fuel_efficient_driving/car_photo.jpg"
import downshift_strategy_summary from "@/content/articles/a6_fuel_efficient_driving/downshift_strategy_summary.png"
import efficiency_map from "@/content/articles/a6_fuel_efficient_driving/efficiency_map.png"
import fixed_gear_load_summary from "@/content/articles/a6_fuel_efficient_driving/fixed_gear_load_summary.png"
import grade_best_strategy_summary from "@/content/articles/a6_fuel_efficient_driving/grade_best_strategy_summary.png"
import grade_shift_rpm_heatmap from "@/content/articles/a6_fuel_efficient_driving/grade_shift_rpm_heatmap.png"
import mixed_route_strategy_comparison from "@/content/articles/a6_fuel_efficient_driving/mixed_route_strategy_comparison.png"
import practical_strategy_grid from "@/content/articles/a6_fuel_efficient_driving/practical_strategy_grid.png"
import practical_strategy_summary from "@/content/articles/a6_fuel_efficient_driving/practical_strategy_summary.png"
import selected_strategy_task_demo from "@/content/articles/a6_fuel_efficient_driving/selected_strategy_task_demo.png"
import shift_rpm_fuel_time from "@/content/articles/a6_fuel_efficient_driving/shift_rpm_fuel_time.png"
import torque_power_curve from "@/content/articles/a6_fuel_efficient_driving/torque_power_curve.png"

export const meta: PostMeta = {
    title: "How to Save Fuel According to Computer Models",
    description:
        "A simplified engine and drivetrain model for testing fuel efficient driving strategies in a manual BMW E36 328i.",
    date: "2026-05-20",
    tags: ["off topic", "python", "modelling", "cars", "aW1nalysis"],
    type: "article",
    slug: "fuel-efficient-driving",
}

export default function Article() {
    return (
        <Body>
            <Text
                lead="Fuel prices. We're all talking about them here in New Zealand, because they've gone through the roof."
                content="EV lovers are having a great time, but what about us petrolheads? I drive a 1996 BMW 328i. It's my pride and joy, quiet, comfortable, sporty, and better looking than the modern techno blob compact SUVs that litter our roads. But it absolutely drinks gas: the rev-happy 2.8L 6 cylinder engine was never built for economy. So what can I do to save on petrol?"
            />

            <ImageBlock
                src={car_photo}
                alt="My 1996 BMW 328i"
                className="w-full"
            />

            <Disclaimer>
                My lovely lady photographed on a 1955 Canon IV camera with hand developed Fomapan 200 film.
            </Disclaimer>

            <Text
                content={
                    <>
                        Arguably, the best thing I can do is ride my motorbike instead, or take public transport. But when
                        taking das Beemer is my best option, how can I get the most out of my gas tank?
                    </>
                }
            />
            <Text
                content={
                    <>
                        Traditional wisdom will tell us things like properly inflating your tyres or removing excess
                        luggage from the vehicle, which is fair enough, although apparently the Government managed to
                        spend{" "}
                        <Link href="https://www.nzherald.co.nz/nz/politics/govts-stretch-every-tank-fuel-saving-tips-campaign-costs-35-million-so-far/22FZ5F3JY5C4LEGGMEATRXUVSA/">
                            $3.5 million saying roughly the same thing
                        </Link>
                        . Very good. Money well spent. But also, we can drive in a way that best suits the engine: by
                        using the right amount of throttle, the right gear, and shifting at the right rpm, we can target
                        the engine's most efficient operating conditions, and thereby decrease fuel consumption.
                    </>
                }
            />

            <Text
                heading="The Model Engine"
                lead="Petrol engines are complex mechanical devices, but for this investigation we only need to understand a few key relationships."
                content="The engine consumes a mixture of fuel and air to produce torque, which is simply a rotational force applied to the crankshaft. Torque is what ultimately accelerates the car, while power describes how quickly the engine can continue applying that torque as RPM increases."
            />

            <Text content="The amount of torque an engine can produce changes throughout its RPM range. At very low RPM, the engine may struggle to produce enough torque to accelerate the car smoothly. As RPM rises, the engine usually reaches a region where it can produce torque more effectively, before eventually losing efficiency and torque again at very high engine speeds due to friction from the internal components, airflow limitations, and other mechanical losses." />

            <Text content="Power, measured in kW, horsepower, or PS, is closely related to both torque and RPM. While torque describes rotational force, power describes how quickly the engine can continue applying that force as engine speed rises. This is why many engines feel strongest through the middle of their RPM range, where they are producing strong torque while also revving fast enough to sustain it." />

            <Text content="Engineers use special machines called dynamometers to measure an engine's torque by measuring the force that it can produce throughout its RPM range. This produces a chart showing both torque and power output vs. RPM:" />

            <ImageBlock
                src={torque_power_curve}
                alt="Synthetic torque and power curve for the BMW M52B28 engine"
                className="w-full"
            />

            <Text content="My model engine starts by creating a synthetic dyno chart based on known torque and power figures for the M52B28 engine. It's an approximation, and won't be exactly the same as a real world dyno chart taken from my car, but it's close enough for this model." />

            <Text content="The dyno chart tells us what the engine is capable of producing, but it doesn't tell us how efficiently it produces that torque. Two operating points might produce similar power while consuming very different amounts of fuel." />

            <Text
                heading="Engine Load"
                lead="Before we can explore efficiency, we must first understand engine load."
                content="Outside of a racetrack, we rarely use the full torque available at a given RPM. Most of the time, we are only asking the engine to produce enough torque to maintain speed, climb a hill, or accelerate at a comfortable rate. Engine load is a term used to describe how much of the total available torque we are using."
            />

            <Text content="For example, imagine cruising along a flat road at 2500 RPM. The throttle is only slightly open because very little torque is required to maintain speed. Now imagine reaching a steep hill. The engine is still turning at 2500 RPM, but now we need more torque to push the car uphill, so we press further on the accelerator. Engine speed has remained the same, but engine load has increased significantly." />

            <Text content="During normal driving, we usually only ask for a fraction of that available torque. An engine cruising gently at low load may only be using 10-20% of what it could actually produce at that RPM." />

            <Text content="This matters because petrol engines are often surprisingly inefficient at very low load. Even though little torque is being produced, the engine must still overcome internal friction, pull air past a mostly closed throttle body, and continue spinning all of its internal components. The result is that using slightly more throttle to produce more useful torque can sometimes improve efficiency, even if fuel consumption increases in absolute terms." />

            <Text content="This gives rise to what engineers call an efficiency map: a chart which shows how efficiently an engine produces torque across different combinations of RPM and load." />

            <Text
                heading="Building the Efficiency Model"
                lead="The efficiency map is not based on a perfect physical simulation of combustion."
                content="Instead, it is a simplified behavioural model designed to reproduce the major trends seen in real naturally aspirated petrol engines."
            />

            <Text content="To achieve this, I introduced several penalty regions into the model. At very low load, the engine suffers pumping losses as it pulls air past a mostly closed throttle body. At very high RPM, friction and airflow losses reduce efficiency. I also modelled a lugging penalty at very low RPM and high load, where the engine struggles to produce large amounts of torque smoothly and efficiently." />

            <Text content="Finally, I added an enrichment penalty at extremely high load. Real petrol engines often inject additional fuel under heavy acceleration to help control combustion temperatures and protect engine components. This improves performance and reliability, but significantly increases fuel consumption." />

            <Text content="The result is not a perfect replica of a real engine calibration map, but it is realistic enough to explore how different driving strategies move the engine through efficient and inefficient operating regions." />

            <ImageBlock
                src={efficiency_map}
                alt="Synthetic efficiency map showing engine efficiency across RPM and load"
                className="w-full"
            />

            <Text content="Here we can see how torque, RPM, and load interact according to my model. The colours represent efficiency, with brighter regions indicating operating conditions where the engine is converting fuel into useful torque more effectively." />

            <Text content='Immediately, we can see the "island of efficiency" appear near the middle of the RPM range, around 2500-3500 RPM and roughly 50-70% load. At very high RPM, efficiency falls away as friction and airflow losses increase. At very low RPM and high load, the engine begins to lug, producing torque inefficiently and often feeling strained or rough to drive. The low load regions are also surprisingly inefficient, because even though little torque is being produced, the engine must still overcome friction and pull air past a mostly closed throttle body.' />

            <Text content="At this point, it might seem like we already have our answer: simply keep the engine near 3000 RPM and moderate load. In an ideal world, that would actually work quite well. Modern CVT transmissions and aggressive drive by wire throttle mapping often attempt to do exactly this. Unfortunately for me, the E36 is still an old school cable throttle, manual gearbox car, which means the engine cannot simply sit at its most efficient operating point all the time." />

            <Text
                heading="Modelling the Drivetrain"
                lead="To move from engine theory to practical driving advice, we now need to model the rest of the drivetrain."
                content="The drivetrain is the parts of the car which transfer the engine's torque to the road: From engine output spline, to clutch, gearbox, driveshaft, differential, axles, and finally the wheels. I sourced the gear ratios for the Getrag G220 gearbox, measured the tyre size fitted to the car, and performed a simple real world driving test to estimate the final drive ratio of the differential, which I then cross checked against known factory options."
            />

            <Text content="I also needed to model the forces resisting the car's motion. Even when cruising at a constant speed, the engine must still produce torque to overcome rolling resistance from the tyres and aerodynamic drag from the air." />

            <Text content="Rolling resistance remains relatively constant, but aerodynamic drag increases rapidly with speed. This is why travelling at 100 km/h consumes significantly more fuel than travelling at 80 km/h, even if the car is no longer accelerating. The engine simply has to work harder to push the car through the air." />

            <Text content="With some additional maths, I can now convert engine speed into road speed, and vice versa, and model the effects of rolling resistance and drag. This unlocks the testing of practical driving tasks and exploring how different loading and shifting strategies affect fuel economy." />

            <Text
                heading="Acceleration: How Hard Should I Press the Pedal?"
                lead="To isolate the effect of engine load, I configured the model to accelerate the car from 20-50 km/h in 3rd gear only, using several different target load values."
                content="By keeping the gear fixed throughout the test, we remove shift timing and gear selection as variables, allowing us to focus purely on how engine load affects fuel consumption."
            />

            <ImageBlock
                src={fixed_gear_load_summary}
                alt="Fuel use and acceleration time for fixed gear acceleration at different engine loads"
                className="w-full"
            />

            <Text content="The results are immediately interesting. Extremely gentle acceleration at 20% load produced by far the worst fuel economy, despite consuming fuel at a lower instantaneous rate. The engine simply spent too long operating in the inefficient low load region of the efficiency map, where pumping losses and internal friction dominate. Increasing the target load to around 50-65% dramatically reduced total fuel usage while also cutting acceleration time significantly." />

            <Text content="However, the model also suggests that there is a practical upper limit. While 80% load reached 50 km/h very quickly, fuel usage increased again as the engine spent more time in the high load regions associated with enrichment and reduced efficiency. In this model, moderate acceleration appears to produce the best balance between fuel economy and drivability." />

            <Text
                heading="Gear Selection and Shifting"
                lead="A gearbox exists because an engine can only operate efficiently over a limited part of its RPM range, while the car itself needs to travel across a much wider range of road speeds."
                content="By changing gears, we change the relationship between engine speed and road speed, which allows us to keep the engine operating closer to its efficient region during acceleration."
            />

            <Text content="Earlier, we found that moderate engine load tends to produce the best efficiency, but load alone is not enough. We also need to consider where each gear change places the engine in the RPM range. If we shift too early, the next gear may drop the engine into a low RPM lugging region where it struggles to produce torque efficiently. Shift too late, and we spend unnecessary time at high RPM where friction and airflow losses become more significant." />

            <Text content="A simple way to explore this tradeoff is to test how different shift RPM strategies affect fuel usage during the task of accelerating from 10-50 km/h." />

            <ImageBlock
                src={shift_rpm_fuel_time}
                alt="Fuel use and acceleration time for different shift RPM strategies"
                className="w-full"
            />

            <Text content='Extremely early shifting performs poorly, despite sounding like the sort of "short shift everywhere" strategy that many people associate with economical driving. As shift RPM rises, fuel consumption falls sharply, before flattening out and then beginning to rise again as the engine spends more time in the high RPM region. In this test, the best strategy used about 40% less fuel than the worst strategy.' />

            <Text content="The practical takeaway is that efficient driving does not mean shifting at the lowest possible RPM. For this model, moderate acceleration combined with midrange shift points keeps the engine closer to its efficient operating region, with roughly 3000-3500 RPM appearing to give the best balance between fuel economy and drivability." />

            <Text
                heading="Real World Driving Tasks"
                lead="Up to this point, we have isolated individual variables like engine load and shift RPM to better understand how they affect fuel efficiency."
                content="Real driving, however, is much messier than a controlled simulation. On New Zealand roads we are constantly moving between cruising, accelerating, climbing hills, and adjusting our speed to suit traffic and road conditions."
            />

            <Text content="Now that we have a rough idea of what the engine likes, we can start adding hills into the mix. Pushing a car uphill requires more work than cruising on the flat, so the first question is simple: does the flat road strategy still work once the road points uphill?" />

            <Text lead="Spoiler alert: You should drive differently on hills" />

            <ImageBlock
                src={practical_strategy_summary}
                alt="Fuel used by flat road and hill adjusted strategies on flat ground and a 5% incline"
                className="w-full"
            />

            <Text content="The flat road strategy works well on flat ground, but once it is applied unchanged to a 5% incline, fuel use rises noticeably." />

            <Text content="Adjusting the strategy for the hill cuts fuel use by about 10% compared with using the flat road rule unchanged. We can't escape the physics that requires us to spend more energy to climb a hill, but with another strategy adjustment we can keep our engine at its most efficient." />

            <Text
                heading="How Hills Change the Strategy"
                lead="To make the hill problem more practical, I tested a range of load targets and shift RPMs on flat ground, then repeated the same test on a 5% grade."
                content="Each cell is one 50-80 km/h acceleration test. The top number is fuel used, and the smaller number below it is the time taken to complete the acceleration."
            />

            <ImageBlock
                src={practical_strategy_grid}
                alt="Fuel use across load and shift RPM strategies on flat ground and a 5% grade"
                className="w-full"
            />

            <Text content="The flat road result stays close to what we have already seen: moderate load and a midrange shift point work well, and the model is fairly tolerant of small changes around that region." />

            <Text content="On the 5% grade, the best result moves towards a higher load target and a later shift point. The low load, early shift combinations become much worse because the engine is being asked to pull uphill from the wrong part of its operating range." />

            <Text content="That gives us the broad idea: Hills shift the efficient strategy towards more load and a shorter gear." />

            <Text
                heading="Well, how steep is a hill?"
                lead="The 5% grade test showed that hills move the best strategy towards a higher load target and a later shift point."
                content="To see how far this pattern continues, I ran the same acceleration task across a wider range of road gradients"
            />

            <ImageBlock
                src={grade_shift_rpm_heatmap}
                alt="Fuel use heatmap across road gradient and shift RPM strategies"
                className="w-full"
            />

            <Text content="We see here that higher shift RPM becomes less punishing as the road gets steeper. On flat ground, shifting later than necessary mostly adds revs without adding much useful work, but on steeper grades those extra revs help keep the engine away from the low RPM, high load region." />

            <Text content="This does not mean the highest shift RPM is always best. The more useful conclusion is that hills make early shifting much riskier, while making shorter gears more acceptable. If the car is climbing and the engine feels strained, holding the gear longer is not just a performance habit, it can be the more efficient choice." />

            <Text lead="Quantifying this change: How much does it actually matter?" />

            <ImageBlock
                src={grade_best_strategy_summary}
                alt="Best tested shift RPM and fuel use across different road gradients"
                className="w-full"
            />

            <Text content="On the steeper hills, using the best tested shift point makes a meaningful difference. At 6-8% gradients, the best strategy is roughly 13-25% better than shifting at 3500 RPM, and around 28-57% better than shifting at 3000 RPM." />

            <Text content="To summarise all this stuff: if the hill is steep, don't be afraid to 'let her rev'. Without knowing your exact car, it's still fair to say that extra RPM can be less costly than forcing the engine to pull from too low in the rev range." />

            <Text
                heading="Adding Load Back Into the Mix"
                lead="So far, the hill tests have mostly focused on shift RPM."
                content="We have found that holding a shorter gear can be important on hills, but shift RPM is only half the strategy. The engine still needs the right load target if we want it to stay near the efficient island."
            />

            <ImageBlock
                src={selected_strategy_task_demo}
                alt="Fuel use and acceleration time for different load targets on a 5% grade"
                className="w-full"
            />

            <Text content="Here I fixed the shift point at 4000 RPM, then tested the same 5% grade acceleration at different load targets. The best result sits around 70% load, using 34.7 mL of fuel, while 50% load uses 45.5 mL. That means the best tested load target uses about 24% less fuel than the weakest result in this test." />

            <Text content="The trend is similar to the earlier flat road load test, but again, the hill penalises inefficient strategies more harshly, and generally prefers staying on the aggressive side of moderate." />

            <Text
                heading="Should I Downshift Before I Start Climbing?"
                lead="If hills favour a shorter gear and a slightly higher load target, the next question is whether it is worth downshifting before the hill."
                content="To test this, I compared the current flat road strategy against a downshift strategy, then repeated the downshift with a slightly higher load target."
            />

            <ImageBlock
                src={downshift_strategy_summary}
                alt="Fuel use and acceleration time for downshift strategies on a hill"
                className="w-full"
            />

            <Text content="The result is small, but useful. Downshifting on its own does not really help, because the engine is moved to a different RPM without changing how much useful work it is being asked to do. The fuel use is effectively the same as the baseline." />

            <Text content="The downshift only becomes useful when it is combined with a slightly higher load target. That is the important part: the goal of downshifting is not just to make the engine rev higher, but to place it in a region where it can produce the required torque efficiently." />

            <Text content="So yes, if I am about to climb a hill, downshifting can be the right move, but only if I also use the engine properly after the shift. A lower gear with the same timid throttle input does not achieve much. A lower gear with a sensible load target keeps the engine closer to the efficient island." />

            <Text
                heading="Am I any good at driving?"
                lead="Now that the model has tested load, shift RPM, hills, and downshifting separately, I want to see how my own driving stacks up against my model."
                content="I need to quantify my current driving style in the same way as these tests were done: by specifying my load target and shift RPM under different conditions."
            />

            <Text content="I reckon I use about 30% load, and I shift early at 2800 RPM, since I don't like revving my engine too high because of my noisy exhaust. Around town, I try to cruise in 4th gear. On the open road, I drive in a more spirited manner, and I reckon I use around 50% load there, and shift at around 3800 RPM, where I use the extra power and rev range to safely and quickly make cornering manoeuvres on twisty roads. Above 70 km/h, I almost always shift into 5th gear, since it keeps noise and vibration down." />

            <Text content="I simulated a short driving route of flats, hills, and varied speed, then plugged my own driving strategy into the simulator." />

            <Text content="Then I used the model to generate the best possible strategies for each driving task along the route, and compared fuel usage between myself and the model:" />

            <ImageBlock
                src={mixed_route_strategy_comparison}
                alt="Cumulative fuel use and excess fuel compared with the model informed strategy"
                className="w-full"
            />

            <Text content="My current driving style used 518.2 mL over the route, while the model informed strategy used 497.4 mL. That is a saving of 20.8 mL, or about 4.0%. It's not shown in the chart, but the model was also 6% faster to finish the route." />

            <Text content="Ok, 4% saving is not life changing, and I would also not expect the real car to reproduce this exact number on every drive. But it does show that the earlier results compound in a sensible way: less time lugging the engine, fewer lazy shifts on hills, and more time spent near the efficient operating region means less fuel used." />

            <Text
                heading="So, What Should I Actually Change?"
                lead="The model does not tell me to drive slowly."
                content="It suggests that some of my careful, low load driving is not as efficient as it feels. The better strategy is to accelerate with moderate purpose, shift in the midrange, and avoid forcing the engine to pull from too low in the rev range."
            />

            <Text content="I should probably let the engine work a little harder and rev a little higher. Sound like good fun!" />

            <Text
                heading="What This Model Does Not Prove"
                lead="This is still a simplified model, not a fuel flow test on my actual car."
                content="I have no idea how accurate this model is. If I really cared, my next step would be to hook up a flow meter to my fuel lines and actually measure fuel usage. Real fuel depends on so many things: wind, road surface, tyre pressure, engine condition, driver input, what engine oil I used and how much of it, the list goes on."
            />

            <Text content="So I would not claim that this proves my E36 will save exactly 4.0% fuel if I copy the model informed strategy. The stronger claim is more modest: the model gives a consistent explanation for why overly gentle driving can be inefficient, why hills punish early shifting, and why a downshift only helps when it places the engine in a better operating region." />

            <Text
                heading="Conclusion"
                lead="For my car, I should just drive a little bit harder (when appropriate)."
                content="And I'd like to extend that idea to most older cars: We could all save fuel by driving with a little more intention."
            />

            <Text content="Not recklessly, or trying to beat a land speed record, but just letting the car do its thing. Realistically, it appears that you are not likely to save on fuel by being ginger careful on the throttle. It's not as simple as slow = less fuel used. Plus, we'll all spend less time on the road, reducing traffic and getting us all to our destinations just that little bit faster." />

            <Text content="(Of course, always drive to the road conditions, and if you aren't comfortable doing a reasonable speed on the road, you should probably address that with driving lessons). (Yes I do get frustrated by painfully slow drivers and am very pleased with the results of this investigation)." />

            <Text content="So I'll take this information to the driver's seat and enjoy pushing my BMW a bit harder. That's where these old sports cars seem happiest anyway." />
        </Body>
    )
}
