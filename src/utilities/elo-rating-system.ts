class EloRatingSystem {
  private kFactor: number;

  constructor(kFactor: number = 32) {
    this.kFactor = kFactor;
  }

  private expectedScore(playerRating: number, opponentRating: number): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  updateRating(
    currentRating: number,
    opponentRating: number,
    actualScore: number
  ): number {
    const expectedScore = this.expectedScore(currentRating, opponentRating);

    return currentRating + this.kFactor * (actualScore - expectedScore);
  }
}

export default EloRatingSystem;
