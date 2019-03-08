import {defaultSocketNamespace, IHttpSocketEndpoint} from '@essential-projects/http_contracts';
import {IEndpointSocketScope} from '@essential-projects/websocket_contracts';

export abstract class BaseSocketEndpoint implements IHttpSocketEndpoint {

  public get namespace(): string {
    return defaultSocketNamespace;
  }

  public abstract initializeEndpoint(endpoint: IEndpointSocketScope): Promise<any> | any;

  /**
   * If any resources need to be disposed when the serves closes down, this
   * method can be implemented in the inheriting class.
   */
  public dispose(): Promise<void> | void { return; }
}
