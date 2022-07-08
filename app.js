function getRandomValue(min, max) {
   return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
   data() {
      return {
         playerHealth: 100,
         monsterHealth: 100,
         playerMinDmg: 5,
         playerMaxDmg: 12,
         monsterMinDmg: 8,
         monsterMaxDmg: 15,
         currentRound: 0,
         winner: null,
         logMessages: []
      }
   },
   computed: {
      monsterBarStyles() {
         if (this.monsterHealth <= 0) { return { width: '0' }; }
         else return { width: this.monsterHealth + "%" }
      },
      playerBarStyles() {
         if (this.playerHealth <= 0) { return { width: '0' }; }
         else return { width: this.playerHealth + "%" }
      },
      mayUseSpecialAttack() {
         return this.currentRound % 3 !== 0;
      },

   },

   watch: {
      playerHealth(value) {
         if (value <= 0 && this.monsterHealth <= 0) {
            this.playerHealth = 0;
            this.monsterHealth = 0;
            this.winner = 'draw';
         } else if (value <= 0) {
            this.playerHealth = 0;
            this.winner = 'monster';
         }
      },
      monsterHealth(value) {
         if (value <= 0 && this.playerHealth <= 0) {
            this.playerHealth = 0;
            this.monsterHealth = 0;
            this.winner = 'draw';
         } else if (value <= 0) {
            this.monsterHealth = 0;
            this.winner = 'player';
         }
      }
   },

   methods: {
      newGame() {
         this.playerHealth = 100;
         this.monsterHealth = 100;
         this.currentRound = 0;
         this.winner = null;
         this.logMessages = [];
      },

      attackMonster() {
         this.currentRound++;
         const attackValue = getRandomValue(this.playerMinDmg, this.playerMaxDmg);
         this.monsterHealth -= attackValue;
         this.addLogMsg('player', 'attack', attackValue);
         this.attackPlayer();
      },
      attackPlayer() {
         const attackValue = getRandomValue(this.monsterMinDmg, this.monsterMaxDmg)
         this.playerHealth -= attackValue;
         this.addLogMsg('monster', 'attack', attackValue);
      },
      specialAttack() {
         this.currentRound++;
         const attackValue = getRandomValue(10, 25);
         this.monsterHealth -= attackValue;
         this.addLogMsg('player', 'attack', attackValue);
         this.attackPlayer();
      },
      healPlayer() {
         this.currentRound++;
         const healValue = getRandomValue(8, 20);
         if (this.playerHealth + healValue > 100) {
            this.playerHealth = 100;
         }
         else {
            this.playerHealth += healValue;
         }
         this.addLogMsg('player', 'heal', healValue);
         this.attackPlayer();
      },
      surrender() {
         this.winner = 'monster';
      },
      addLogMsg(who, what, value) {
         this.logMessages.unshift({
            actionBy: who,
            actionType: what,
            actionValue: value
         });
      },
      barColor(hp) {
         if (hp > 50) {
            return { backgroundColor: '#1d9d34' }
         }
         else if (hp <= 50 && hp > 20) {
            return { backgroundColor: '#e5870e' }
         }
         else return { backgroundColor: '#a80000' }
      }
   }
}).mount("#game")