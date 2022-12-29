import { shallowMount } from '@vue/test-utils'
import Login from '../Login.vue'

const wrapper = shallowMount(Login)

// The Login to test
const MessageLogin = {
  template: '<p>{{ msg }}</p>',
  props: ['msg']
}

test('displays message', () => {
  // mount() returns a wrapped Vue Login we can interact with
  const wrapper = mount(MessageLogin, {
    propsData: {
      msg: 'Hello world'
    }
  })

  // Assert the rendered text of the Login
  expect(wrapper.text()).toContain('Hello world')
})