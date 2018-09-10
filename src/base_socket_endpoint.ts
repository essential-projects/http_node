import {IHttpSocketEndpoint} from '@essential-projects/http_contracts';
import '@types/socket.io';

export class BaseSocketEndpoint implements IHttpSocketEndpoint {

  private _socketServer: SocketIO.Server = undefined;

  public config: any = undefined;

  /* tslint:disable-next-line:no-empty */
  constructor() { }

  public get namespace(): string {
    const namespace: string = this.config.namespace;
    if (!namespace) {
      return '';
    }

    return namespace;
  }

  public initializeEndpoint(socketIo: SocketIO.Server): Promise<any> | any { return; }

  public dispose(): Promise<void> | void { return; }
}
