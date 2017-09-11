import styled from 'styled-components';
import media from '../../utils/media';

const Div = styled.div`
    column-count: 4;
    margin: 0 auto;
    max-width: 1200px;
    padding: 5px 10px 0 10px;
    
    ${media.desktop`column-count: 3;`}
    ${media.tablet`column-count: 2;`}
    ${media.phone`column-count: 1;`}
`;

export default Div;
