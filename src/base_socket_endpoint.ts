import {IHttpSocketEndpoint} from '@essential-projects/http_contracts';

export class BaseSocketEndpoint implements IHttpSocketEndpoint {

  public initializeEndpoint(socketIo: SocketIO.Namespace): Promise<any> | any { return; }

  public dispose(): Promise<void> | void { return; }
}
