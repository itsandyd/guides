import { FC } from 'react';
import TalentTree from './TalentTree';
import TalentRow from './TalentRow';
import Talent from './Talent';

const BloodDeathKnightTalents: FC = () => {
  const pointsAvailable = 30; // Total points available to allocate

  return (
    <div className="talent-tree">
      <h2 className="text-2xl font-semibold mb-4">Blood Death Knight Talent Tree</h2>
      <div className="points-available">
        <span className="font-semibold">Points Available:</span> {pointsAvailable}
      </div>
      <TalentTree>
        <TalentRow>
          <Talent 
            name="Icebound Fortitude"
            description="Reduces all damage taken by 30% and makes you immune to Stun effects for 8 seconds."
            cooldown="2 min"
          />
          <Talent
            name="Death Strike"
            description="Deals a significant amount of physical damage and heals you for 25% of the damage you took over the last 5 seconds or 7% of your maximum HP, whichever is greater. Also applies Mastery: Blood Shield for a percentage of the raw healing done (even if overhealed)."
            cost="45 Runic Power"
          />
          <Talent
            name="Raise Dead"
            description="Summons Timmy, your ghoul. Timmy will attack your target for 1 minute or until he dies, and periodically casts (uncontrollably) Gnaw, stunning them for 1 second. This is an offensive cooldown, as Timmy does a lot of damage."
            cooldown="2 min"
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Runic Attenuation"
            description="Auto-attacks have a very high (10.8 procs per minute, hasted) chance to generate 5 Runic Power."
          />
          <Talent
            name="Improved Death Strike"
            description="Death Strike costs 5 Runic Power less, and heals you for 10% more."
          />
          <Talent
            name="Cleaving Strikes"
            description="Allows Heart Strike to hit a total of 5 targets while you are in Death and Decay, and additionally causes all Death and Decay-enabled buffs to persist for four seconds after leaving your Death and Decay. Death and Decay expiring also triggers this, allowing you to get 14 seconds of Death and Decay-related value per Death and Decay cast."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Mind Freeze"
            description="Interrupts the target if they were casting and, if it worked, locks them out of that school of magic for 3 seconds."
            cooldown="15s"
            range="15yd"
          />
          <Talent
            name="Blinding Sleet"
            description="Disorients anything in a 16yd cone in front of you. When the effect fades, they are slowed by 50% for 6s."
            cooldown="1 min"
            range="16yd"
          />
          <Talent
            name="Anti-Magic Barrier"
            description="Anti-Magic Shell's absorbed amount is 40% bigger (i.e. 42% of max HP) and its cooldown is reduced to 40 seconds."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="March of Darkness"
            description="Death's Advance grants you an additional 25% bonus movement speed for the first 3 seconds of its duration. Zoom zoom!"
          />
          <Talent
            name="Unholy Ground"
            description="While you are in your Death and Decay, you gain 5% haste."
          />
          <Talent
            name="Control Undead"
            description="Allows you to control certain Undead enemies. While controlled, you may gain access to some of their abilities. This has game-breaking situational use - whenever there is some value in this, we will highlight it in the encounter guides."
            cost="1 Rune"
            range="30yd"
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Enfeeble"
            description="Your ghoul's auto attacks can occasionally snare enemies by 30% and cause them to deal 15% less damage to you for 6 seconds."
          />
          <Talent
            name="Sacrificial Pact"
            description="Sacrifices your ghoul, healing you for 25% of your maximum health and dealing a burst of shadow damage to anything in its vicinity."
            cooldown="2 min"
            cost="20 Runic Power"
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Coldthirst"
            description="Successfully interrupting something with Mind Freeze grants you 10 Runic Power and lowers the cooldown of Mind Freeze to 12s."
          />
          <Talent
            name="Proliferating Chill"
            description="Chains of Ice's snare also applies to the target's closest enemy."
          />
          <Talent
            name="Permafrost"
            description="40% of your damage dealt through auto-attacks is also applied as a shield on you."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Veteran of the Third War"
            description="20% more stamina."
          />
          <Talent
            name="Death Pact"
            description="Heals you for 50% of your maximum HP and applies a healing absorption shield on you for 30% of your max HP. All healing received while this is active will instead pay off this healing absorption effect."
            cooldown="2 min"
          />
          <Talent
            name="Brittle"
            description="Blood Plague ticks have a 15% chance to make them take 6% more damage from your class and spec abilities."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Death's Reach"
            description="Death Grip is now a 40yd spell. Dealing a killing blow to an enemy that yields experience or honor resets the cooldown of Death Grip."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Icy Talons"
            description="Spending Runic Power increases your attack speed by 3% for 6 seconds, stacking up to 3 times."
          />
          <Talent
            name="Anti-Magic Zone"
            description="Creates a zone on the floor that lasts for 8 seconds, or until it absorbs 150% of your max HP in damage. While allies are in it, 20% of the magic damage they take is absorbed by the zone."
            cooldown="2 min"
          />
          <Talent
            name="Unholy Bond"
            description={
              <>
                Modifies your runeforges:
                <ul>
                  <li>Rune of the Fallen Crusader: Strength gain increased from 15% to 18%. Healing proc increased from 6% to 7.2%</li>
                  <li>Rune of Hysteria: Runic Power generation increased from 20% to 24%. Maximum RP increased by 23</li>
                  <li>Rune of the Stoneskin Gargoyle: Stamina, Armor and Strength gained increased from 5% to 6%.</li>
                  <li>Rune of Sanguination: Rune of Sanguination now grants a bonus 1.3% damage to Death Strike for every 1% missing from your target's health, up to 80% missing (i.e. 104% bonus vs. 96% bonus)</li>
                </ul>
              </>
            }
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Ice Prison"
            description="turns Chains of Ice into a 4 second root (and also causes Proliferating Chill to apply the root to the nearest enemy), but adds a 12 second cooldown to Chains of Ice"
          />
          <Talent
            name="Gloom Ward"
            description="All absorbs cast on you are 15% stronger. This includes all of your own absorbs (Anti-Magic Shell, Anti-Magic Zone, Permafrost, Mastery: Blood Shield...)"
          />
          <Talent
            name="Asphyxiate"
            description="Stuns a target for 5 seconds."
            cooldown="45s"
            range="20yd"
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Assimilation"
            description="Increases the size of Anti-Magic Zone by 10% and allows you to gain up to 100 Runic Power (0.6 Runic Power per percent of your max HP in damage) when it absorbs damage."
          />
          <Talent
            name="Wraith Walk"
            description="While channelling, you are 70% faster. Casting Wraith Walk also frees you from all roots and makes you immune to them for the duration of the spell."
            cooldown="1 min"
            channel="4s"
          />
          <Talent
            name="Grip of the Dead"
            description="When an enemy enters your Death and Decay, they are slowed by 90%, reducing by 10% per second, starting from the moment they take a tick of damage from Grip of the Dead. With careful planning, it is possible to permanently snare enemies by 90%."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Soul Reaper"
            description="Deals light Shadowfrost damage to an enemy and applies a DoT to them. When this DoT expires, if the target is below 35%, this deals a significant amount more damage. If the target dies while Soul Reaper is applied to them, you temporarily gain Runic Corruption, effectively gaining 0.45 Runes over 3 seconds (Runic Corruption's effect is halved for blood, for reasons better known to the developers)"
            cooldown="6s"
            cost="1 Rune"
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Suppression"
            description="Grants you 3% avoidance. Additionally, when you get CCed, you gain an additional 6% avoidance for 6 seconds."
          />
          <Talent
            name="Blood Scent"
            description="3% Leech."
          />
          <Talent
            name="Unholy Endurance"
            description="Increases the duration of Lichborne to 12 seconds. While Lichborne is active, you also gain 15% damage reduction."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Osmosis"
            description="Anti-Magic Shell increases all healing (not absorbs) you receive while it is active by 15%"
          />
          <Talent
            name="Insidious Chill"
            description="Causes your auto-attacks to apply an attack speed reduction debuff, for a total of 20% attack speed reduction per target. This debuff has a 30 second duration and is not unique, and stacks with all other attack speed reductions in the game. This gives you a strong incentive to tab target in AoE"
          />
          <Talent
            name="Runic Protection"
            description="Grants you 6% bonus Armor rating. The critical strike inhibition is irrelevant to Blood Death Knights as we already have it in our spec aura"
          />
        </TalentRow>
        <TalentRow>
          <Talent 
            name="Blood Draw"
            description={
              <>
                When you drop below 30%, three separate effects happen:
                <ul>
                  <li>You instantly leech 120% AP damage from all enemies within 8 yards, causing you to be healed for the damage you dealt</li>
                  <li>You take 10% less damage for the next 8 seconds</li>
                  <li>Death Strike's cost is reduced by 10 Runic Power (i.e. 25 RP total cost) for the next 8 seconds, and this is not consumed on use</li>
                </ul>
              </>
            }
            cooldown="Internal cooldown: 2 min"
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Rune Mastery"
            description="Spending a Rune on any ability except Path of Frost has a chance to increase your Strength by 3% (Rank 1) / 6% (Rank 2) for 8 seconds."
          />
          <Talent
            name="Subduing Grasp"
            description="When you attempt to grip an enemy through Death Grip, Gorefiend's Grasp or Abomination Limb's periodic grips, they deal 6% less damage to you for 6 seconds. When considering the value of this talent, be aware that Death Grip taunts, and as a result, abusing this will lead to taunt immunity and pain."
          />
          <Talent
            name="Will of the Necropolis"
            description="All damage taken below 30%, or damage that would take you below 30%, is reduced by 20% (or 35% at rank 2)."
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Null Magic"
            description="All magic damage you take is reduced by 10%, and most (but not all) Magic debuffs on you fade 35% faster"
          />
          <Talent
            name="Unyielding Will"
            description="Anti-Magic Shell's cooldown is increased by 20 seconds. Using it instantly clears any harmful Magic effects on you"
          />
          <Talent
            name="Abomination Limb"
            description="Triggers 13 pulses of damage, the first occuring instantly, and all the others every 1 second after; these damage all enemies within 8 yards. Every time it ticks, it attempts to pull an enemy to you if there is an enemy in combat that is further than 8 yards from you. Attempting to pull an enemy puts a debuff on them, preventing them from being pulled for 4 seconds. Each attempt at pulling a target (i.e. Abomination Limb has found a potential target) triggers Bone Collector, even if that enemy was immune to grips."
            cooldown="2 min"
          />
        </TalentRow>
        <TalentRow>
          <Talent
            name="Death's Echo"
            description="Death Grip, Death's Advance and Death and Decay all gain an additional charge"
          />
          <Talent
            name="Vestigial Shell"
            description="When you cast Anti-Magic Shell, your two nearest allies gain a Lesser Anti-Magic Shell. This absorbs 425% of your AP's worth of damage, causes debuffs to fade 50% faster, but contrary to Anti-Magic Shell, it does not allow them to immune abilities or debuffs"
          />
        </TalentRow>
      </TalentTree>
    </div>
  );
};

export default BloodDeathKnightTalents;
