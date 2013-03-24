#!/usr/bin/env python
#Contains the base custom Request Handler class.
#Also contains utility functions for various operations.
from logging import error
import webapp2, jinja2

def getEnvironment(cfile, folder = '', autoescape = True):
	"""Sets the jinja environment of the template to the supplied folder(relative path) or else to the current path."""
	from os import path
	location = path.dirname(cfile)
	if folder:
		location = path.join(location, folder)
	return jinja2.Environment(autoescape = autoescape, loader = jinja2.FileSystemLoader(location))

class BaseRequestHandler(webapp2.RequestHandler):
	"""This is the base handler for all other Request Handlers.
	"""
	#This variable stores the jinja2 environment of the templates.
	environment = None

	#This variable will store the name of the file which is the template for this Handler's response HTML page.
	template = None

	def __init__(self, *args):
		"""Initializes self.template to the- actual template file in stored in BaseRequestHandler.template"""
		super(BaseRequestHandler, self).__init__(*args)
		if self.environment:
			self.template = self.environment.get_template(self.template)

	def render(self, non_template=None, **kwargs):
		"""Renders a template with the specified keyword arguments."""
		if self.template:
			self.response.out.write(self.template.render(**kwargs))
		else:
			self.response.out.write(non_template)

	def post(self):
		"""By default the post request performs a get unless overridden."""
		self.get()

class URLMap:
	"""This is a Data Structure which keeps hold of all (URL,Handler) mappings.""" 
	handler_list = []

	@classmethod
	def add(cls, *args):
		for handler in args:
			cls.handler_list.append(handler)