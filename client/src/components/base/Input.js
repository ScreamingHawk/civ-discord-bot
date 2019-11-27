import styled from 'styled-components'

export default styled.input`
	color: ${({ theme }) => theme.text};
	background: transparent;
	border: none;
	border-bottom: 1px solid grey;
	margin: 0 2px;
	font-size: 1.5em;
	max-width: 100%;
`
