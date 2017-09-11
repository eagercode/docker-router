import { css } from 'styled-components';

const media = {
    giant: (args: TemplateStringsArray) => css`
        @media only screen and (max-width: ${1170 / 16}em) {
            ${css(args)}
        }`,
    desktop: (args: TemplateStringsArray) => css`
        @media only screen and (max-width: ${992 / 16}em) {
            ${css(args)}
        }`,
    tablet: (args: TemplateStringsArray) => css`
        @media only screen and (max-width: ${768 / 16}em) {
            ${css(args)}
        }`,
    phone: (args: TemplateStringsArray) => css`
        @media only screen and (max-width: ${376 / 16}em) {
            ${css(args)}
        }`,
};

export default media;
