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
            //name, type, service
        });
        it('should throw an error when called without a string name parameter', () => {
            const NAME_MESSAGE = 'ACTION_BUILDER: the name parameter should be a string.';
            expect(()=>{ actionBuilder({name: undefined})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 1})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: {}})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: ()=>{}})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test'})}).to.not.throw(NAME_MESSAGE);
        });
        it('should throw an error when called without a string type parameter : load,save,delete', () => {
            const NAME_MESSAGE = 'ACTION_BUILDER: the type parameter should be a string and the value one of these: load,save,delete.';
            expect(()=>{ actionBuilder({name: 'test'})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: undefined})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: 1})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: {}})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: ()=>{}})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: ''})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: 'nimp'})}).to.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: 'load'})}).to.not.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: 'save'})}).to.not.throw(NAME_MESSAGE);
            expect(()=>{ actionBuilder({name: 'test', type: 'delete'})}).to.not.throw(NAME_MESSAGE);
        });
    })
});
