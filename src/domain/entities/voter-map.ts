import * as _ from 'lodash';

export class VoterMap {
  voters: { voterId: number; voted: boolean };
  electionId: number;

  constructor(electionId: number, voters: number[]) {
    this.voters = _.reduce(
      voters,
      (result, v) => {
        result[v] = true;
        return result;
      },
      {},
    );
    this.electionId = electionId;
  }

  alreadyVoted(voterId: number): boolean {
    return !!this.voters[voterId];
  }
}

