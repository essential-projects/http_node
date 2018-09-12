import {IHttpSocketEndpoint} from '@essential-projects/http_contracts';

export class BaseSocketEndpoint implements IHttpSocketEndpoint {

  private _socketServer: SocketIO.Server = undefined;

  public config: any = undefined;

  /* tslint:disable-next-line:no-empty */
  constructor() { }

  public initializeEndpoint(socketIo: SocketIO.Namespace): Promise<any> | any { return; }

  public dispose(): Promise<void> | void { return; }
}
