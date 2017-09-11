import styled from 'styled-components';

const Span = styled.span`
    &:before {
        content: " \\25CF";
        float: right;
        font-size: 1.5em;
        right: 3%;
        position: absolute;
        top: 0.2em;
    }

    color: ${(props: { isActive: boolean }) => props.isActive ? '#4CAF50' : '#E53935'};
`;

export default Span;
