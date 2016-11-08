import {filterNonValidatedFields, validateField} from '../validations';
import {definitions, domains} from '../../example/config';
import {INPUT_ERROR} from '../../actions/input';

const FIELDS_CONFIG = JSON.parse('{"fields":[{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"city","entityPath":"address","dataSetValue":"Kubland","rawInputValue":"Kubland","formattedInputValue":"Kubland - formaté"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"user","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"lastName","entityPath":"user","dataSetValue":"De Libercourt","rawInputValue":"De Libercourt","formattedInputValue":"De Libercourt - formaté"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"childs","entityPath":"user","dataSetValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"rawInputValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"formattedInputValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"redirectEntityPath":"child"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"address","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"}],"nonValidatedFields":["user.firstName","user.lastName", {"user.childs":["firstName"]}]}')


describe('Form: validation', () => {
  describe('when the validateField is called', ()=> {
    const dispatchSpy = sinon.spy();
    beforeEach(() => {
        dispatchSpy.reset();
    })
    describe('with a simple field', ()=> {
      it('should validate the name given correct defintion and value' , ()=>{
        const validationResult = validateField(definitions, domains, 'formBalec', 'user.information', 'firstName', 'NewName', dispatchSpy);
        expect(validationResult).to.be.true;
        expect(dispatchSpy).to.have.callCount(0);
      });
      it('should dispatch an invalid the name given correct defintion and value' , ()=>{
        const validationResult = validateField(definitions, domains, 'formBalec', 'user.information', 'firstName', 12, dispatchSpy);
        expect(validationResult).to.be.false;
        expect(dispatchSpy).to.have.callCount(1);
        const dispatchArgs = dispatchSpy.lastCall.args[0];
        expect(dispatchArgs.type = INPUT_ERROR);
        expect(dispatchArgs.formKey === 'formBalec');
        expect(dispatchArgs.entityPath === 'user.information');
        expect(dispatchArgs.fieldName === 'firstName');
        expect(dispatchArgs.error.length > 0 );
      });
    });
    describe('with a list field', ()=> {
      it('should validate the name given correct defintion and value' , ()=>{
        const newListValue = [
          {firstName:'FirstChildOne',lastName:'LastChildOne'},
          {firstName:'FirstChildTwo',lastName:'LastChildTwo'}
        ];
        const validationResult = validateField(definitions, domains, 'formBalec', 'user.information', 'childs', newListValue, dispatchSpy);
        expect(validationResult).to.be.true;
        expect(dispatchSpy).to.have.callCount(0);
      });
      it('should throw an error when the data type is not an array in case of a redirect', () => {
          const WRONG_DEFINITION_ERROR = `MIDDLEWARES_FIELD_VALIDATION: Your field childs in the entity user.information don't have a domain, you may have an array field which have a **redirect** property in it`;
          const wrongDefinition = () => validateField(definitions, domains, 'formBalec', 'user.information', 'childs', 12, dispatchSpy);
          expect(wrongDefinition).to.throw(WRONG_DEFINITION_ERROR)
      });
      it('should throw an error when the redirect is incorrect', () => {
        const WRONG_REDIRECT_ERROR = `MIDDLEWARES_FIELD_VALIDATION: Your field childs in the entity user.information don't have a domain, you may have an array field which have a **redirect** property in it.`
        const def = {...definitions, user: {...definitions.user, redirect: 12}};
        const wrongDefinition = () => validateField(definitions, domains, 'formBalec', 'user.information', 'childs', 12, dispatchSpy);
        expect(wrongDefinition).to.throw(WRONG_REDIRECT_ERROR)
      });
      it('should dispatch an invalid the name given correct defintion and an incorrect value' , ()=>{
        const newListValue = [
          {firstName:1,lastName:'LastChildOne'},
          {firstName:'FirstChildTwo',lastName: 'test'}
        ];
        const validationResult = validateField(definitions, domains, 'formBalec', 'user.information', 'childs', newListValue, dispatchSpy);
        expect(validationResult).to.be.false;
        expect(dispatchSpy).to.have.callCount(1);
        const dispatchArgs = dispatchSpy.lastCall.args[0];
        expect(dispatchArgs.type = INPUT_ERROR);
        expect(dispatchArgs.formKey === 'formBalec');
        expect(dispatchArgs.entityPath === 'user.information');
        expect(dispatchArgs.fieldName === 'firstName');
      //  expect(dispatchArgs.error.length > 0 );
      });
    });
  })

  it('filterNonValidatedInListField', () => {
    const FIELD_TO_VALIDATE = [
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"city","entityPath":"address","dataSetValue":"Kubland","rawInputValue":"Kubland","formattedInputValue":"Kubland - formaté"},
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"user","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"},
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"childs","entityPath":"user",
        "dataSetValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],
        "rawInputValue":[{"lastName":"LastChildOne"},{"lastName":"LastChildTwo"}],
        "formattedInputValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"redirectEntityPath":"child"},
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"address","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"}
    ];

    const CANDIDATE_FIELD_TO_VALIDATE = filterNonValidatedFields(FIELDS_CONFIG.fields,FIELDS_CONFIG.nonValidatedFields );
    expect(
      CANDIDATE_FIELD_TO_VALIDATE
    ).to.deep.equal(FIELD_TO_VALIDATE)
  })
})
