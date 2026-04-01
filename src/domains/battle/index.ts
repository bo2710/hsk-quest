export interface BattleState {
  bossHp: number;
  playerHp: number;
  combo: number;
  timeRemainingSec: number;
}

export const battleDomain = {
  initializeBoss: (hskLevel: number): BattleState => ({
    bossHp: hskLevel * 500, // Boss cấp cao máu càng trâu
    playerHp: 100,
    combo: 0,
    timeRemainingSec: 60 // Chế độ Time Attack 60 giây
  }),

  // Tính damage khi User trả lời đúng
  calculateDamage: (state: BattleState, isCorrect: boolean, timeSec: number): BattleState => {
    if (!isCorrect) {
      // Trả lời sai: Mất combo, trừ máu người chơi
      return { ...state, playerHp: state.playerHp - 20, combo: 0 };
    }

    // Trả lời đúng: Tăng combo, damage x1.5 hoặc x2 nếu combo cao, đánh nhanh damage to
    const newCombo = state.combo + 1;
    const comboMultiplier = newCombo > 5 ? 2 : (newCombo > 2 ? 1.5 : 1);
    const speedBonus = timeSec < 2 ? 50 : (timeSec < 5 ? 20 : 0);
    
    const baseDamage = 50;
    const totalDamage = (baseDamage + speedBonus) * comboMultiplier;

    return {
      ...state,
      bossHp: Math.max(0, state.bossHp - totalDamage),
      combo: newCombo
    };
  }
};