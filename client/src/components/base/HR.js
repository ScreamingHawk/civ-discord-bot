import styled from 'styled-components'

export default styled.hr`
	color: ${({ theme }) => theme.text};
	opacity: 0.5;
	width: 80%;
	margin: 20px auto;
	border: none;
	border-bottom: 1px solid;
`