#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
from utilities import *
# from google.appengine.ext import db


class HomePage(BaseRequestHandler):
	environment = getEnvironment(__file__)
	template = 'index.html'

	def get(self):
		self.render()

class MainJS(BaseRequestHandler):
    environment = getEnvironment(__file__, autoescape=False)
    template = 'main.js'

    def get(self):
        self.response.headers['Content-Type'] = 'text/javascript'
        self.render()

class MainCSS(BaseRequestHandler):
    environment = getEnvironment(__file__, autoescape=False)
    template = 'main.css'

    def get(self):
        self.response.headers['Content-Type'] = 'text/css'
        self.render()

class Error404(BaseRequestHandler):
    environment = getEnvironment(__file__)
    template = '404.html'

    def get(self):
        self.error(404)
        self.render()


URLMap.add(
	('/', HomePage),
    ('/main\.js', MainJS),
    ('/main\.css', MainCSS),
    ('/.*', Error404)
	)

app = webapp2.WSGIApplication(utils.URLMap.handler_list, debug=True)