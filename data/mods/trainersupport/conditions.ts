export const Conditions: {[id: string]: ModdedConditionData} = {
	larryboost: {
		name: 'larryboost',
		noCopy: true,
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.type === 'Normal' || move.type === 'Flying') return this.chainModify([4915, 4096]);
		},
	},
	stevenboost: {
		name: 'stevenboost',
		noCopy: true,
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
	},
	lanceboost: {
		name: 'lanceboost',
		noCopy: true,
		onSourceAfterFaint(length, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				source.removeVolatile('mustrecharge');
				this.add('-message', `${source.name} recharged instantly!`);
			}
		},
	},
	roxieboost: {
		name: 'roxieboost',
		noCopy: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.flags['sound']) return this.chainModify([4915, 4096]);
		},
	},
	roxanneboost: {
		name: 'roxanneboost',
		noCopy: true,
		onBasePower(basePower, pokemon, target, move) {
			if (move.type === 'Rock') return this.chainModify([4915, 4096]);
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy, target, source, move) {
			if (typeof accuracy !== 'number' || move.type !== 'Rock') return;
			return this.chainModify([4915, 4096]);
		},
	},
	sidneyboost: {
		name: 'sidneyboost',
		noCopy: true,
		onTryBoost(boost, target, source, effect) {
			// Don't bounce self stat changes, or boosts that have already bounced
			if (!source || target === source || !boost || effect.name === 'Mirror Armor' || effect.name === 'sidneyboost') return;
			let b: BoostID;
			for (b in boost) {
				if (boost[b]! < 0) {
					if (target.boosts[b] === -6) continue;
					const negativeBoost: SparseBoostsTable = {};
					negativeBoost[b] = boost[b];
					delete boost[b];
					if (source.hp) {
						this.boost(negativeBoost, source, target, null, true);
					}
				}
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.type === 'Dark') return this.chainModify([4505, 4096]);
		},
	},
	brycenmanboost: {
		name: 'brycenmanboost',
		noCopy: true,
		onAfterMoveSecondary(target, source, move) {
			if (source && source !== target && move?.flags['contact']) {
				if (target.item || target.switchFlag || target.forceSwitchFlag || source.switchFlag === true) {
					return;
				}
				const yourItem = source.takeItem(target);
				if (!yourItem) {
					return;
				}
				if (!target.setItem(yourItem)) {
					source.item = yourItem.id;
					return;
				}
				this.add('-enditem', source, yourItem, '[silent]');
				this.add('-message', `${target.name} stole ${source.name}'s ${yourItem}!`);
			}
		},
		onSourceModifyAccuracyPriority: -1,
		onSourceModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return this.chainModify(1.1);
		},
	},
	learboost: {
		name: 'learboost',
		noCopy: true,
		onResidualOrder: 6,
		onResidual(pokemon) {
			if (pokemon.item) this.heal(pokemon.baseMaxhp / 32);
		},
	},
	flintboost: {
		name: 'flintboost',
		noCopy: true,
		onModifyMove(move, pokemon) {
			if (move.id === 'willowisp') move.accuracy = true;
		},
		onBasePowerPriority: 30,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type !== 'Fire') return;
			const basePowerAfterMultiplier = this.modify(basePower, this.event.modifier);
			this.debug(`Base Power: ${basePowerAfterMultiplier}`);
			if (basePowerAfterMultiplier <= 75) {
				this.debug('Technician boost');
				return this.chainModify(1.5);
			}
		},
	},
	minaboost: {
		name: 'minaboost',
		noCopy: true,
		onModifySecondaries(secondaries) {
			this.debug('Shield Dust prevent secondary');
			return secondaries.filter(effect => !!effect.self);
		},
		onTryBoost(boost, target, source, effect) {
			if (source && target === source) return;
			if (boost.spe && boost.spe < 0) {
				delete boost.spe;
				if (!(effect as ActiveMove).secondaries) {
					this.add("-fail", target, "unboost", "Speed");
				}
			}
		},
	},
	dustinboost: {
		name: 'dustinboost',
		noCopy: true,
		onBasePowerPriority: 21,
		onBasePower(basePower, pokemon, defender, move) {
			if (move.type !== 'Steel') return;
			let boosted = true;
			for (const target of this.getAllActive()) {
				if (target === pokemon) continue;
				if (this.queue.willMove(target)) {
					boosted = false;
					break;
				}
			}
			if (boosted) {
				this.debug('Analytic boost');
				return this.chainModify([5325, 4096]);
			}
		},
	},
	laceyboost: {
		name: 'laceyboost',
		noCopy: true,
		onModifyMove(move) {
			if (move.type === 'Fairy' || move.type === 'Ground') move.ignoreAbility = true;
		},
	},
	willboost: {
		name: 'willboost',
		noCopy: true,
		onStart(source) {
			if (!source.hasType('Psychic') && !source.terastallized) {
				let futuresight = false;
				for (const moveSlot of source.moveSlots) {
					if (moveSlot.id === 'futuresight') {
						if (source.addType('Psychic')) this.add('-start', source, 'typeadd', 'Psychic');
					}
				}
			}
		},
	},
	cguysboost: {
		name: 'cguysboost',
		noCopy: true,
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (['Grass', 'Fire', 'Water'].includes(move.type)) return this.chainModify([4505, 4096]);
		},
	},
	lysandreboost: {
		name: 'lysandreboost',
		noCopy: true,
		onAnyBasePowerPriority: 20,
		onAnyBasePower(basePower, source, target, move) {
			//console.log(target.baseSpecies.name + " " + move.name + " " + target.getMoveHitData(move).typeMod);
			if (target === source || move.category === 'Status' || target.getMoveHitData(move).typeMod < 0) return;
			if (!move.auraBooster?.volatiles['lysandreboost']) move.auraBooster = this.effectState.target;
			//if (move.auraBooster) console.log(move.auraBooster.baseSpecies.name);
			if (move.auraBooster !== this.effectState.target) return;
			return this.chainModify([5448, 4096]);
		},
	},
	whitneyboost: {
		name: 'whitneyboost',
		noCopy: true,
		onStart(pokemon) {
			this.effectState.lastMove = '';
			this.effectState.numConsecutive = 0;
		},
		onTryMovePriority: -2,
		onTryMove(pokemon, target, move) {
			if (move.callsMove) return;
			if (this.effectState.lastMove === move.id && pokemon.moveLastTurnResult) {
				this.effectState.numConsecutive++;
			} else if (pokemon.volatiles['twoturnmove']) {
				if (this.effectState.lastMove !== move.id) {
					this.effectState.numConsecutive = 1;
				} else {
					this.effectState.numConsecutive++;
				}
			} else {
				this.effectState.numConsecutive = 0;
			}
			this.effectState.lastMove = move.id;
		},
		onModifyDamage(damage, source, target, move) {
			const dmgMod = [4096, 4505, 4915, 5324, 5734, 6144];
			const numConsecutive = this.effectState.numConsecutive > 5 ? 5 : this.effectState.numConsecutive;
			//console.log(`Current Metronome boost: ${dmgMod[numConsecutive]}/4096`);
			return this.chainModify([dmgMod[numConsecutive], 4096]);
		},
		onTryBoost(boost, target, source, effect) {
			if (source && (target === source || target.gender !== 'F')) return;
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "unboost");
			}
		},
	},
	
		
	//vanilla
	sandstorm: {
		inherit: true,
		durationCallback(source, effect) {
			let duration = 5;
			if (source?.hasItem('smoothrock')) {
				duration = 8;
			}
			if (source.side.trainerBoost === 'steven') duration += 2;
			return duration;
		},
	},
};
