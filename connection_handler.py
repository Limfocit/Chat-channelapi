'''
Created on 04.08.2011

@author: Limfocit
'''
from google.appengine.ext import db
from google.appengine.ext import webapp
from main import OnlineUser
from google.appengine.ext.webapp.util import run_wsgi_app

def handle_disconnection(channel_id):
    # Find all their subscriptions and delete them.
    q = OnlineUser.all().filter('channel_id =', channel_id)
    users = q.fetch(1000)  
    db.delete(users)


class ChannelConnectHandler(webapp.RequestHandler):
    def post(self):
        channel_id = self.request.get('from')
        q = OnlineUser.all().filter('channel_id =', channel_id)
        user = q.fetch(1)[0]
        user.opened_socket = True
        user.put()


class ChannelDisconnectHandler(webapp.RequestHandler):
    def post(self):
        channel_id = self.request.get('from')
        q = OnlineUser.all().filter('channel_id =', channel_id)
        users = q.fetch(1000)  
        db.delete(users)
        

application = webapp.WSGIApplication([
    ('/_ah/channel/connected/', ChannelConnectHandler),
    ('/_ah/channel/disconnected/', ChannelDisconnectHandler),
])


def main():
    run_wsgi_app(application)


if __name__ == "__main__":
    main()

