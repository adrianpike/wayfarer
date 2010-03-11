module Wayfarer

	module Objects

		class Base
			attr_accessor(:x,:y,:heading, :game_id)
			
			def initialize
				@x=0;@y=0;@heading=0;@game_id = Wayfarer::World.unique_id
			end
		
			def tick
		  end
		
			def to_s
				"#{self.class.to_s} (##{game_id}) - #{x},#{y},#{heading}"
			end
			
			def to_json
				'{"game_id":'+game_id.to_s+',"x":'+x.to_s+',"y":'+y.to_s+',"heading":'+heading.to_s+'}';
			end
		
		end
	
		class Moveable < Base
			attr_accessor(:v_rot,:v)

	    def tick
	    end
		
		end	

		class Player < Base
			attr_accessor(:acceleration, :rotation_speed, :max_rotation, :max_velocity, :ip, :login)
		
			def initialize
				super
				
				@x=rand(100)-50
				@y=rand(100)-50
				@heading = rand(360)
				
				@max_rotation = 1

				@rotation_speed = 0
				@acceleration_speed = 0.1
				@max_velocity = 2.0
				
				@v = 0; @v_rot = 0; @acceleration = 0.0
			end
		
			def tick
				@x += Math.sin(heading * Math::PI / 180)*@v
				@y += Math.cos(heading * Math::PI / 188)*@v
				@heading += @rotation_speed

				# input 
				@v+=@acceleration
				@v=@max_velocity if (@v>@max_velocity)
				@v-=(@v / 10.0) if (@v>0)
			end
	
			def to_s
				"#{self.class.to_s} (##{game_id}) - #{x},#{y},#{heading},#{@v},#{acceleration},#{rotation_speed}"
			end
		
			def to_json
				'{"type":"player","game_id":'+game_id.to_s+',"x":'+x.to_s+
				',"y":'+y.to_s+',"heading":'+heading.to_s+',"player_name":"'+login.to_s+'"}';
			end
		
	  end
	
	end
	
end