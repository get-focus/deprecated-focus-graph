import {actionBuilder} from '../entity-actions-builder';
describe('The actionBuilder', () => {
    describe('when called with wrong parameters', () => {
//        let component;
        before(
            () => {
  //              const shallowRenderer = TestUtils.createRenderer();
    //            shallowRenderer.render(<Input/>);
      //          component = shallowRenderer.getRenderOutput();
            }
        );
        it('should throw a type error when called without all parameters', () => {
            expect(()=>{ actionBuilder()}).to.throw(TypeError,"Cannot read property 'name' of undefined");
//            name, type, service
        });
        it('should throw a type error when called without the good name parameter', () => {
            const NAME_MESSAGE = 'ACTION_BUILDER: the name parameter should be a string.';
            expect(()=>{ actionBuilder({name: undefined})}).to.throw(Error, NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 1})}).to.throw(Error, NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: {}})}).to.throw(Error, NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: ()=>{}})}).to.throw(Error, NAME_MESSAGE);
        });
    })
});
