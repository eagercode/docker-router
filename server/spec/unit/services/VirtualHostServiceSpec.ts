import { SinonStub } from 'sinon';

import CliService from '../../../src/services/CliService';
import Constants from '../../../src/common/Constants';
import VirtualHost from '../../../src/model/VirtualHost';
import VirtualHostConverter from '../../../src/converters/VirtualHostConverter';
import VirtualHostService from '../../../src/services/VirtualHostService';
import DockerService from '../../../src/services/DockerService';

const sinon = require('sinon');

describe('VirtualHostService', () => {

    let cliService: CliService;
    let converter: VirtualHostConverter;
    let dockerService: DockerService;
    let service: VirtualHostService;

    beforeEach(() => {
        cliService = new CliService();
        converter = new VirtualHostConverter();
        dockerService = new DockerService();
        service = new VirtualHostService(cliService, dockerService, converter);
    });

    describe('getAll', () => {
        it('virtual hosts should be loaded', (done: DoneFn) => {
            const expectedCommand: string = `sed -e '/^    #id=/,/^    #end/!d' ${Constants.ROUTER_CONFIG_FILE}`;
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(`
    #id=0509b6c18de7,name=test_first
    upstream localhost {
        server 10.11.12.13;
    }

    server {
        server_name url.org;

        location / {
            proxy_pass         https://url.org;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }
    #end
    #id=5771cb594cf6,name=test_second
    upstream localhost {
        server 127.0.0.1;
    }

    server {
        server_name test.env.eu;

        location / {
            proxy_pass         http://test.env.eu;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }
    #end
    #id=3549d4f07au3,name=test_third
    upstream localhost {
        server 192.168.1.124;
    }

    server {
        server_name intranet;

        location / {
            proxy_pass         http://intranet;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }
    #end`));
            const expectedResult: { [key: string]: VirtualHost } = {
                '0509b6c18de7': new VirtualHost('0509b6c18de7', '10.11.12.13', 'https://url.org', 'test_first'),
                '5771cb594cf6': new VirtualHost('5771cb594cf6', '127.0.0.1', 'http://test.env.eu', 'test_second'),
                '3549d4f07au3': new VirtualHost('3549d4f07au3', '192.168.1.124', 'http://intranet', 'test_third'),
            };

            service.getAll()
                .then((vHosts: { [key: string]: VirtualHost }) => {
                    expect(vHosts).toEqual(expectedResult);
                    done();
                })
                .catch((err: string) => done.fail(err));

            sinon.assert.calledWith(stub, expectedCommand);
        });

        it('virtual hosts str is null', (done: DoneFn) => {
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(null));

            service.getAll()
                .then((vHosts: { [key: string]: VirtualHost }) => {
                    expect(vHosts).toEqual({});
                    done();
                })
                .catch((err: string) => done.fail(err));
        });

        it('virtual hosts str is incomplete', (done: DoneFn) => {
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(`
    upstream localhost {
        server 192.168.1.124;
    }

    server {
        server_name intranet;

        location / {
            proxy_pass         http://intranet;
            proxy_redirect     off;
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
            proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Host $server_name;
        }
    }`));

            service.getAll()
                .then((vHosts: { [key: string]: VirtualHost }) => {
                    expect(vHosts).toEqual({});
                    done();
                })
                .catch((err: string) => done.fail(err));
        });
    });

    describe('add', () => {
        it('virtual host should be appended to file', (done: DoneFn) => {
            const vHostDescription: string = 'Virtual Host Description';
            const converterStub: SinonStub = sinon.stub(converter, 'virtualHostToStr');
            converterStub.returns(vHostDescription);
            const execStub: SinonStub = sinon.stub(cliService, 'exec');
            execStub.returns(Promise.resolve(true));
            const vHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com', 'test_name');
            const expectedCommand: string = 'sed -i -- \'s@#v_hosts@#v_hosts\\n' + vHostDescription + '@g\' ' + Constants.ROUTER_CONFIG_FILE;

            const result = service.add(vHost);

            sinon.assert.calledWith(execStub, expectedCommand);
            result.then((value: boolean) => {
                expect(value).toBe(true);
                done();
            });
        });

        it('virtual host must be defined', (done: DoneFn) => {
            const result = service.add(null);

            result
                .then(() => done.fail())
                .catch(done);
        });

        it('virtual host id must be defined', (done: DoneFn) => {
            const vHost: VirtualHost = new VirtualHost(null, '127.0.0.1', 'http://eager-code.eu', 'eager_code');

            const result = service.add(vHost);

            result
                .then(() => done.fail())
                .catch(done);
        });

        it('virtual host name must be defined', (done: DoneFn) => {
            const vHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '127.0.0.1', 'http://eager-code.eu');

            const result = service.add(vHost);

            result
                .then(() => done.fail())
                .catch(done);
        });
    });

    describe('remove', () => {

        it('virtual host should be removed', (done: DoneFn) => {
            const id: string = 'e4ef2b5b9f98';
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(true));
            const expectedCommand: string = `sed -i -- '/^    #id=${id}/,/^    #end/{d}' ${Constants.ROUTER_CONFIG_FILE}`;

            const result = service.remove(id);

            sinon.assert.calledWith(stub, expectedCommand);
            result
                .then((value: boolean) => {
                    expect(value).toBe(true);
                    done();
                })
                .catch((error: string) => done.fail(error));
        });

        it('id should be required', (done: DoneFn) => {
            const result = service.remove(null);

            result
                .then(() => done.fail())
                .catch(done);
        });
    });

    describe('removeByName', () => {

        it('virtual host should be removed', (done: DoneFn) => {
            const name: string = 'eager_code';
            const stub: SinonStub = sinon.stub(cliService, 'exec');
            stub.returns(Promise.resolve(true));
            const expectedCommand: string = `sed -i -- '/,name=${name}/,/^    #end/{d}' ${Constants.ROUTER_CONFIG_FILE}`;

            const result = service.removeByName(name);

            sinon.assert.calledWith(stub, expectedCommand);
            result
                .then((value: boolean) => {
                    expect(value).toBe(true);
                    done();
                })
                .catch((error: string) => done.fail(error));
        });

        it('name should be required', (done: DoneFn) => {
            const result = service.removeByName(null);

            result
                .then(() => done.fail())
                .catch(done);
        });
    });

    describe('update', () => {

        it('virtual host should be updated', (done: DoneFn) => {
            sinon.stub(service, 'add').returns(Promise.resolve(true));
            const removeStub: SinonStub = sinon.stub(service, 'remove');
            removeStub.returns(Promise.resolve(true));
            sinon.stub(dockerService, 'restart').returns(Promise.resolve(true));
            const vHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com', 'eager_code');

            const result = service.update(vHost);

            sinon.assert.called(removeStub);
            result
                .then((val: boolean) => {
                    if (val) {
                        done();
                    } else {
                        done.fail('Error');
                    }
                })
                .catch((err: string) => done.fail(err));
        });

        it('virtual host should be required', (done: DoneFn) => {
            const vHost: VirtualHost = null;

            const result = service.update(vHost);

            result
                .then(() => done.fail('Error'))
                .catch(done);
        });

        it('virtual host id should be required', (done: DoneFn) => {
            const vHost: VirtualHost = new VirtualHost(null, '10.0.10.225', 'http://test-address.com', 'eager_code');

            const result = service.update(vHost);

            result
                .then(() => done.fail('Error'))
                .catch(done);
        });

        it('virtual host name should be required', (done: DoneFn) => {
            const vHost: VirtualHost = new VirtualHost('e4ef2b5b9f98', '10.0.10.225', 'http://test-address.com');

            const result = service.update(vHost);

            result
                .then(() => done.fail('Error'))
                .catch(done);
        });
    });
});
