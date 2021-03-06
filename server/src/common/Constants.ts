export default class Constants {

    static DEV_SERVER_PORT: number = 8000;
    static PROD_SERVER_PORT: number = 80;
    static PUBLIC_DIR: string = '../public';
    static REST_API_URL_PREFIX: string = '/api';

    static ROUTER_CONFIG_FILE: string = '/opt/router/nginx.conf';
    static ROUTER_CONTAINER_NAME: string = 'dockerrouter_nginx_1';

    static WEB_CONTAINER_ADDRESS: string = 'http://localhost';
    static WEB_CONTAINER_NAME: string = 'dockerrouter_web_1';
}
