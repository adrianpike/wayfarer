require 'json'
require 'logger'

require 'world'
require 'objects'

# This is just a very basic example of the server-side logic needed to respond to a Wayfarer client.

module Wayfarer
	class LaggingException < Exception; end
  
	class Base
	  attr_accessor :config, :world, :logger
	  
		def initialize(logger = Logger.new(STDOUT))
		  @config = YAML.load_file('config.yml')
		  @world = World.new(@config, logger)
		 	@logger = logger
	  end
	
		def input(http_request)
			player_object = JSON::load(http_request.params['object'])
			player = @world.objects[player_object['game_id']]
			if player
				player.rotation_speed = player_object['rotation_speed']
				player.acceleration = player_object['acceleration']
				"true"
			else
				"false"
			end
		end
		
		def login(login, password)
			logger.debug { "#{login} requested a login." }
			# Here's where I should decide whether or not to let the player in.
			if login.size>3 and not @world.players[login] then
				@world.player_join(login)
			else
				logger.debug { "#{login} was rejected." }
				nil
			end
		end
	end
	
  class UpdateThread
    def initialize(wayfarer)
			@wayfarer = wayfarer
    end
    
    def each
      while 1 do
				# TODO: broken pipe, player logged out, network congestion
				js = ''
				@wayfarer.world.objects.each {|id,o|
					js += "Wayfarer.World.update_object('#{id}',#{o.to_json});"
				}
				#js = 'console.log(\'ping\');'
				
        yield "#{js}\n\n" # TODO: this should be sending updated positions of every object in the world.
        sleep 1.0 / @wayfarer.config['network_hz'] # FIXME: should be network hz
      end
    end
  end
	
	class Server
	  def initialize
	    @logger = Logger.new(STDOUT)
			@logger.info { "Wayfarer server initialized." }
	    @wayfarer = Wayfarer::Base.new(@logger)
    end
    
    def jsonp(content,request)
      request.params['jsoncallback']+'('+content.to_json+');'
    end
    
    def handle_join(request)
			user = @wayfarer.login(request.params['login'], request.params['password'])
			if user
	      [200, {"Content-Type" => "text/plain"}, jsonp("alert('yo');",request)]
			else
				[401, {"Content-Type" => "text/plain"}, jsonp("You were rejected.",request)]
			end
    end
	  
	  def handle_input(request)
			[200, {"Content-Type" => "text/plain"}, @wayfarer.input(request) ]
    end
    
    def handle_updates(request)
      [200, {"Content-Type" => "text/plain"}, UpdateThread.new(@wayfarer) ]
    end

		def handle_world_download(request)
			[200, {"Content-Type" => "text/plain"}, jsonp(@wayfarer.world.to_json, request)]
		end
	  
	  def call(env)
			req = Rack::Request.new(env)
      
      case req.path
      when /^\/authenticate/
        handle_join(req)
      when /^\/input/
        handle_input(req)
      when /^\/updates/
        handle_updates(req)
			when /^\/world/
				handle_world_download(req)
			when /^\/$/
				[302, {"Content-Type" => "text/plain", 'Location' => '/client/client.html'}, '']
      else
				[404, {"Content-Type" => "text/plain"}, '404 not found.']
			end
		end
	end
end

