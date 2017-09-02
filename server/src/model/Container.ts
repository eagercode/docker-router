import VirtualHost from './VirtualHost';

export default class Container {

    constructor(public id?: string,
                public image?: string,
                public command?: string,
                public created?: string,
                public status?: string,
                public ports?: string,
                public name?: string,
                public isActive?: boolean,
                public vHost?: VirtualHost) {
    }
}
