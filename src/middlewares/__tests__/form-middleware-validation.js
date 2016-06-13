import {filterNonValidatedInListField, filterF} from '../validations';


const FIELDS_CONFIG = JSON.parse('{"fields":[{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"city","entityPath":"address","dataSetValue":"Kubland","rawInputValue":"Kubland","formattedInputValue":"Kubland - formaté"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"user","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"lastName","entityPath":"user","dataSetValue":"De Libercourt","rawInputValue":"De Libercourt","formattedInputValue":"De Libercourt - formaté"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"childs","entityPath":"user","dataSetValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"rawInputValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"formattedInputValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"redirectEntityPath":"child"},{"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"address","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"}],"nonValidatedFields":["user.firstName",{"user.childs":["firstName"]}]}')


describe.only('Form: validation', () => {
  it('filterNonValidatedInListField', () => {
    const FIELD_TO_VALIDATE = [
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"city","entityPath":"address","dataSetValue":"Kubland","rawInputValue":"Kubland","formattedInputValue":"Kubland - formaté"},
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"user","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"},
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"lastName","entityPath":"user","dataSetValue":"De Libercourt","rawInputValue":"De Libercourt","formattedInputValue":"De Libercourt - formaté"},
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"childs","entityPath":"user",
        "dataSetValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],
        "rawInputValue":[{"lastName":"LastChildOne"},{"lastName":"LastChildTwo"}],
        "formattedInputValue":[{"firstName":"FirstChildOne","lastName":"LastChildOne"},{"firstName":"FirstChildTwo","lastName":"LastChildTwo"}],"redirectEntityPath":"child"},
      {"valid":true,"error":false,"active":true,"dirty":false,"loading":false,"saving":false,"name":"uuid","entityPath":"address","dataSetValue":"1234","rawInputValue":"1234","formattedInputValue":"1234"}
    ];




    /*expect(
      filterNonValidatedInListField(FIELDS_CONFIG.fields,FIELDS_CONFIG.nonValidatedFields )
    ).to.deep.equal(FIELD_TO_VALIDATE)*/
    const CANDIDATE_FIELD_TO_VALIDATE = filterF(FIELDS_CONFIG.fields,FIELDS_CONFIG.nonValidatedFields );
    console.log(CANDIDATE_FIELD_TO_VALIDATE);
    expect(
      CANDIDATE_FIELD_TO_VALIDATE
    ).to.deep.equal(FIELD_TO_VALIDATE)
  })
})
