module Wayfarer
	class World
		
		def self.unique_id
			@@unique_id = -1 unless self.class_variable_defined?(:@@unique_id)
			@@unique_id+=1
		end # Possibly replace with GUIDS or UUIDS, but consider size of transfer

	  attr_accessor :players, :objects, :config, :physics_thread, :running, :logger
  
		def initialize(config, logger)
		  # TODO: move these out to memcached so there can be distributed servers
	    @config = config
	    @running = true
		  @players = {}
		  @objects = {}
			
			@logger = logger
	  
		  physics_thread
		  logging_thread
		
			logger.debug { "Wayfarer world initialized." }
	  end
  
	  def player_join(login, options = {})
			logger.debug { "#{login} just entered the world." }
			
    	p = Wayfarer::Objects::Player.new
			p.login = login
			@players[login] = p
			@objects[p.game_id] = p
	  end
  
		def logging_thread
			@logging_thread = Thread.new {
				while @running do
					logger.debug { "#{@players.keys.size} active players" }
					@players.each{|k,v| 
						logger.debug { " -- #{k} : #{v}" }
					}
					
					sleep 5
				end
			}
			@logging_thread.abort_on_exception = true
		end

	  def physics_thread
	  	secs_per_tick = 1.0 / @config['game_hz']
    
	    @physics_thread = Thread.new {
	      while @running do
					### OLD WAY
	        # start = Time.now.to_f
	        #tick
	        #stop = Time.now.to_f
	        #sleep_time = secs_per_tick - (stop - start)
	        
					# begin
					# 						raise LaggingException if (sleep_time < 0)
					# 		        sleep sleep_time
					# 					rescue LaggingException
					# 						p "SERVER LAG DETECTED IN PHYSICS THREAD"
					# 					end
					
					
					### NEW WAY, POSSIBLE BETTER POSSIBLY WORSE
					Thread.new { tick }
					sleep secs_per_tick
	      end
	    }
			@physics_thread.abort_on_exception = true
	  end
  
	  def tick
	    @objects.each {|k,obj| obj.tick }
	  end
	
		def to_json
			@objects.to_json
		end
	end
end