import { createCallout } from 'okta';
import BaseView from '../internals/BaseView';
import BaseForm from '../internals/BaseForm';
import BaseFooter from '../internals/BaseFooter';
import {getDefaultBackSignInLink} from '../utils/LinksUtil';

const Body = BaseForm.extend({
  noButtonBar: true,
  postRender () {
    BaseForm.prototype.postRender.apply(this, arguments);
    this.$el.addClass('terminal-state');
  },

  title () {
    const messagesObjs = this.options.appState.get('messages');
    if (messagesObjs && Array.isArray(messagesObjs.value)) {
      if (messagesObjs.value.some(messagesObj => messagesObj.i18n?.key === 'idx.return.link.expired')) {
        return 'Verify with your email';
      }
    }
    return BaseForm.prototype.title();
  },

  showMessages () {
    const messagesObjs = this.options.appState.get('messages');
    if (messagesObjs && Array.isArray(messagesObjs.value)) {
      this.add('<div class="ion-messages-container"></div>', '.o-form-error-container');

      messagesObjs.value
        .forEach(messagesObj => {
          const msg = messagesObj.message;
          if (messagesObj.class === 'ERROR' || messagesObj.i18n?.key === 'idx.return.link.expired') {
            this.add(createCallout({
              content: msg,
              type: 'error',
            }), '.o-form-error-container');
          } else {
            this.add(`<p>${msg}</p>`, '.ion-messages-container');
          }
        });

    }
  },

});

const Footer = BaseFooter.extend({
  links: function () {
    return getDefaultBackSignInLink(this.options.settings);
  }
});

export default BaseView.extend({
  Body,
  Footer
});
