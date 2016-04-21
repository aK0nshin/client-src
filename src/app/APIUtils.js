import Ee from 'event-emitter';
import Superagent from 'superagent';

const bindCompetitiveWork = function(idParticipant, idDeclarant, idCompetitiveWork) {
  Superagent.post('/api/v1/contributionSigned/bind')
    .field('idParticipant',idParticipant)
    .field('idDeclarant',idDeclarant)
    .field('idContribution',idCompetitiveWork)
    .end(function(err, res) {
      if (res && res.body && res.body.success) {
        Ee.methods.emit('workBinded');
        sessionStorage.removeItem('idCompetitiveWork');
      } else {
        Ee.methods.emit('unknownError');
      }
    });
  console.log("binding");
  console.log(idCompetitiveWork);
  console.log(idParticipant);
  console.log(idDeclarant);
};

Ee.methods.on('workBindingReady', bindCompetitiveWork);
