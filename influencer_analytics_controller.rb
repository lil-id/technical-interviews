class Api::V1::InfluencerAnalyticsController < ApplicationController
    def index
      page = params[:page] || 1
      per_page = params[:per_page] || 50
      
      cache_key = "influencer_analytics:#{current_user.agency_id}:#{page}:#{per_page}"
          
    @analytics = Rails.cache.fetch(cache_key, expires_in: 2.minutes) do
        influencers = current_user.agency.influencers
          .includes(:engagement_metrics)
          .page(page)
          .per(per_page)
        
        total_pages = (influencers.total_count / per_page.to_f).ceil
        
        {
          data: influencers.map { |i| serialize_influencer(i) },
          meta: {
            total_pages: total_pages,
            current_page: page,
            per_page: per_page
          }
        }
      end
      render json: @analytics
    end

    private
  
    def serialize_influencer(influencer)
        {
        id: influencer.id,
        name: influencer.name,
        followers: influencer.followers_count,
        engagement_rate: calculate_engagement_rate(influencer),
        platform_metrics: fetch_platform_metrics(influencer)
        }
    end
    
    def calculate_engagement_rate(influencer)
        metrics = influencer.engagement_metrics.last(30)
        return 0 if metrics.empty?
        
        total_engagement = metrics.sum(&:engagement_count)
        total_followers = metrics.sum(&:follower_count)
        
        (total_engagement.to_f / total_followers * 100).round(2)
    end
    
    def fetch_platform_metrics(influencer)
        Rails.cache.fetch("platform_metrics:#{influencer.id}", expires_in: 5.minutes) do
        PlatformMetricsService.fetch_latest(influencer)
        end
    end
end