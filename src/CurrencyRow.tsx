import React from 'react'
interface Props {
    name: string
    nameInput: string
    currencyOptions: string[]
    selectedCurrency: string
    onChangeCurrency: ((event: React.ChangeEvent<HTMLSelectElement>) => void)
    onChangeAmount: ((event: React.ChangeEvent<any>) => void)
    amount: number
}

export default class CurrencyRow extends React.Component<Props> {
    render() {
        return (
            <div style={container}>
                <select style={dropDown} value={this.props.selectedCurrency} onChange={this.props.onChangeCurrency}
                        name={this.props.name}>
                    {this.props.currencyOptions.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}

                </select>
                <input type="number" style={inputStyle} name={this.props.nameInput} value={this.props.amount}
                       onChange={this.props.onChangeAmount}/>
            </div>
        )
    }
}

const container: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyItems: 'center',
    textAlignLast: 'center',
}

const dropDown: React.CSSProperties = {
    fontSize: '1em',
    lineHeight: '1em',
    padding: '.5em',
    width: '50%',
    margin: '0.5em 0',
    borderRadius: '3rem',
}

const inputStyle: React.CSSProperties = {
    fontSize: '1em',
    lineHeight: '1em',
    padding: '.6em 1.4em 0',
    maxWidth: '50%',
    borderRadius: '3rem',
}
