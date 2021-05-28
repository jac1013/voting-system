import { Election } from '../entities/election';
import { ElectionRepository } from '../database/election-repository';
import { BlockchainProvider } from '../providers/blockchain-provider';

export interface ElectionInteractor {
  create(election: Election): Promise<Election>;
  update(election: Election): Promise<Election>;
  remove(id: number): Promise<void>;
  getAll(): Promise<Election[]>;
  start(electionId: number): Promise<Election>;
  end(electionId: number): Promise<Election>;
}

export class ElectionInteractorImpl implements ElectionInteractor {
  private electionRepo: ElectionRepository;
  private blockchainProvider: BlockchainProvider;

  constructor(
    electionRepo: ElectionRepository,
    blockchainProvider: BlockchainProvider,
  ) {
    this.electionRepo = electionRepo;
    this.blockchainProvider = blockchainProvider;
  }

  async create(election: Election): Promise<Election> {
    // TODO: this needs more error handling
    const e = await this.electionRepo.save(election);
    const box = await this.blockchainProvider.createWallet();
    e.votingBoxId = box.id;
    return await this.electionRepo.save(election);
  }

  getAll(): Promise<Election[]> {
    return Promise.resolve([]);
  }

  remove(id: number): Promise<void> {
    return Promise.resolve(undefined);
  }

  async start(electionId: number): Promise<Election> {
    // TODO: needs more error handling
    const election = await this.electionRepo.get(electionId);
    election.start();
    return await this.electionRepo.save(election);
  }

  async end(electionId: number): Promise<Election> {
    // TODO: needs error handling
    const election = await this.electionRepo.get(electionId);
    election.end();
    return await this.electionRepo.save(election);
  }

  update(election: Election): Promise<Election> {
    // TODO: this needs more error handling
    return this.electionRepo.save(election);
  }
}
