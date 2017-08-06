import Container from '../../src/model/Container';

export default class ContainerBuilder {

    private container: Container = new Container();

    withTitle(title: string): ContainerBuilder {
        this.container.title = title;

        return this;
    }

    build(): Container {
        return this.container;
    }
}
