import React, { Component } from 'react'
import IntlTelInput from 'react-intl-tel-input'
import 'react-intl-tel-input/dist/main.css'
import logo from '../images/logo.png'
import { Redirect, Link} from 'react-router-dom'

import { FormGroup, FormFeedback } from 'reactstrap'

import { Reginputs} from 'sb-lp-framework'

export default class SecondRegform extends Component {
    constructor(props) {
        super(props)

        this.state = {
            form: {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                phone_number: ''
            },
            errors: {}
        }

    }

    componentDidMount() {
        if (this.props.location.state) this.setState({form: Object.assign(this.state.form, this.props.location.state.form)})
    }

    sendData = () => {
        let form = this.state.form,
        checkParams = this.props.validateParams(form)
        
        if (checkParams.success) this.setState({loading: true, errors: {}}, () => {
            this.props.setLeadData(form)
            .then(this.props.handleSubmit)
            .then(res => (res.redirectUrl && res.success) ? window.location = res.redirectUrl : this.setState({path: '/', fail: true, responseError: res.error}))
        })
        else this.setState({errors: checkParams.errors, loading: false})
    }

    render() {
        let languageManager = this.props.languageManager(),
        stepone = {   
            inputs: [
                {
                    name: 'first_name',
                    type: 'text',
                    className: 'inputfield small-input inline',
                    errorClass: 'inputError',
                    groupClass: 'col-sm-6'
                },
                {
                    name: 'last_name',
                    type: 'text',
                    className: 'inputfield small-input inline',
                    errorClass: 'inputError',
                    groupClass: 'col-sm-6'
                }
            ],
        },
        steptwo = {   
            inputs: [
                {
                    name: 'email',
                    type: 'email',
                    className: 'inputfield small-input',
                    errorClass: 'inputError',
                    groupClass: 'form_group'
                },
                {
                    name: 'password',
                    type: 'password',
                    maxLength: 8,
                    className: 'inputfield small-input',
                    errorClass: 'inputError',
                    groupClass: 'form_group'
                },
            ],
        }

        if (!this.state.path) { 
            return (
                <div className="SecondRegform Regform">
                    {
                        (!this.state.loading) ?
                        <div className='inner'>
                            <div className='form-wrapper one'>

                                <div className="row">

                                    <Reginputs 
                                        {...stepone}
                                        form={this.state.form}
                                        trackStartEdit={this.props.trackStartEdit}
                                        languageManager={languageManager}
                                        errors={this.state.errors}
                                        onChange={form => this.setState({form})}
                                        onFocus={() => {}}/>

                                </div>


                                <Reginputs 
                                        {...steptwo}
                                        form={this.state.form}
                                        trackStartEdit={this.props.trackStartEdit}
                                        languageManager={languageManager}
                                        errors={this.state.errors}
                                        onChange={form => this.setState({form})}
                                        onFocus={() => {}}/>


                                <FormGroup style={{width: '100%'}}>
                                    <IntlTelInput
                                        style={{width: '100%'}}
                                        fieldName="phone_number"
                                        preferredCountries={[this.props.countryCode]}
                                        containerClassName="intl-tel-input"
                                        inputClassName="inputfield tel small-input"
                                        defaultCountry={this.props.countryCode}
                                        autoPlaceholder={true}
                                        separateDialCode={true}
                                        value={this.state.form.phone_number}
                                        format={true}
                                        onPhoneNumberChange={(a, value, b) => {value = value.replace(/\D/g,''); this.setState({form: this.props.updateValue(this.state.form, value, 'phone_number')})}}
                                        />
                                    {this.state.errors.hasOwnProperty('phone_number') && this.state.errors['phone_number']['messages'] &&
                                    <FormFeedback style={{display: 'block'}}>{this.state.errors['phone_number'].messages[0]}</FormFeedback>}

                                </FormGroup>
                                <div className="btn-block">
                                    <button onClick={this.sendData} className='start' >{languageManager.button}</button>
                                </div>
                            </div>
                    </div> : 
                    (!this.state.fail) ?
                        <img src={logo} alt="loading" className="loading"/> :
                        <div>
                            <div className="errors">{this.state.redirectUrl}</div>
                            <Link to={{ pathname: this.state.path, search: this.props.location.search, state: this.state}}><button className='start' >OK</button></Link>
                        </div>
                    }
            </div>)

        } else { return <Redirect to={{ pathname: this.state.path, search: this.props.location.search, state: this.state}}/> }

    }
}
