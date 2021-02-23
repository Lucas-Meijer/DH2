export const Abilities: {[abilityid: string]: ModdedAbilityData} = {
	acidrocknerfed: {
		shortDesc: "On switch-in, this Pokémon poisons every Pokémon on the field.",
		onStart(pokemon) {
			for (const target of this.getAllActive()) {
				if (!target || !this.isAdjacent(target, pokemon) || target.status) continue;
				if (target.hasAbility('soundproof')) {
					this.add('-ability', pokemon, 'Acid Rock');
					this.add('-immune', target, "[from] ability: Soundproof", "[of] " + target);
				} else if (!target.runStatusImmunity('psn')) {
					this.add('-ability', pokemon, 'Acid Rock');
					this.add('-immune', target);
				} else {
					target.setStatus('psn', pokemon);
				}
			}
		},
		name: "Acid Rock (Nerfed)",
		rating: 4,
		num: -1045,
	},
	assembly: {
		shortDesc: "More Wishiwashi spawn at the end of each turn.",
		onStart(pokemon) {
			if (pokemon.species.id === 'wishiwashimega') {
				this.add('-message', `${pokemon.name}'s school got scared and fled...`);
			}
		},
		onResidualOrder: 27,
		onResidual(pokemon) {
			if (pokemon.baseSpecies.baseSpecies !== 'Wishiwashi' || pokemon.transformed || !pokemon.hp) return;
			if (
				pokemon.species.id === 'wishiwashi' || pokemon.species.id === 'wishiwashischool' ||
				pokemon.species.id === 'wishiwashimegaschool'
			) return;
			this.add('-activate', pokemon, 'ability: Assembly');
			this.add('-message', `More of ${pokemon.name}'s friends came together!`);
			if (pokemon.species.id === 'wishiwashimega') {
				pokemon.formeChange('Wishiwashi-Mega-1', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega1') {
				pokemon.formeChange('Wishiwashi-Mega-2', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega2') {
				pokemon.formeChange('Wishiwashi-Mega-3', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega3') {
				pokemon.formeChange('Wishiwashi-Mega-4', this.effect, true);
			} else if (pokemon.species.id === 'wishiwashimega4') {
				pokemon.formeChange('Wishiwashi-Mega-School', this.effect, true);
			}
			pokemon.baseMaxhp = Math.floor(Math.floor(
				2 * pokemon.species.baseStats['hp'] + pokemon.set.ivs['hp'] + Math.floor(pokemon.set.evs['hp'] / 4) + 100
			) * pokemon.level / 100 + 10);
			const newMaxHP = pokemon.volatiles['dynamax'] ? (2 * pokemon.baseMaxhp) : pokemon.baseMaxhp;
			pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
			pokemon.maxhp = newMaxHP;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		isPermanent: true,
		name: "Assembly",
		rating: 5,
		num: -5000,
	},
};
