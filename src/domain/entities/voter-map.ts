import * as _ from 'lodash';

export class VoterMap {
  voters: any; // {'voterId': boolean}
  electionId: number;

  constructor(electionId: number, voters: number[]) {
    this.voters = _.map(voters, (v) => {
      const o = {} as any;
      o[v] = true;
      return o;
    });
    this.electionId = electionId;
  }

  alreadyVoted(voterId: number): boolean {
    return !!this.voters[voterId];
  }
}
