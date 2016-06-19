Rails.application.routes.draw do
  get '/' => 'home#index'
  get '/home/index' => 'home#index'

  # usage: /home/distanced?lat=60.1688202&lng=24.9337834
  # latitude & longitude
  get '/home/distanced' => 'home#all_with_distance'

  # this migth be totally useless
  get 'beer/:id' => 'alco_drinks#show'

  get 'alco_drinks/broad/:id' => 'alco_drinks#show_broad_json'
  get 'alco_drinks/broader/:id' => 'alco_drinks#show_broader_json'

  post 'geocode/forward' => 'geocode#forward'
  post 'geocode/backward' => 'geocode#backward'

  get 'geocode/forward' => 'geocode#address'
  get 'geocode/backward' => 'geocode#coords'

  resources :reviews
  resources :alco_drinks
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
