import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Shield, 
  BarChart3, 
  Bell, 
  Target,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  LineChart,
  Users,
  Award,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'
import './App.css'

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold gradient-text">SK AX AIOps</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-purple-600 transition-colors">
                주요 기능
              </button>
              <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-purple-600 transition-colors">
                서비스
              </button>
              <button onClick={() => scrollToSection('performance')} className="text-gray-700 hover:text-purple-600 transition-colors">
                성능 지표
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-purple-600 transition-colors">
                회사 소개
              </button>
              <Button className="gradient-bg text-white hover:opacity-90">
                문의하기
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                주요 기능
              </button>
              <button onClick={() => scrollToSection('services')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                서비스
              </button>
              <button onClick={() => scrollToSection('performance')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                성능 지표
              </button>
              <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 rounded-lg transition-colors">
                회사 소개
              </button>
              <Button className="w-full gradient-bg text-white">
                문의하기
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fade-in-up">
              <Badge className="gradient-bg text-white border-0 px-4 py-1.5">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                AI 기반 광고 최적화 플랫폼
              </Badge>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                데이터로 만드는<br />
                <span className="gradient-text">스마트한 마케팅</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                SK AX가 제공하는 AI 기반 광고 최적화 플랫폼으로 사용자 행동을 분석하여 전략 인사이트를 실시간 제공합니다
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gradient-bg text-white hover:opacity-90 text-lg px-8 py-6">
                  데모 시작하기
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                  자세히 보기
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">87.5%</div>
                  <div className="text-sm text-gray-600 mt-1">정확도</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">&lt;100ms</div>
                  <div className="text-sm text-gray-600 mt-1">응답속도</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">99.9%</div>
                  <div className="text-sm text-gray-600 mt-1">가용성</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative float-animation">
              <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">실시간 대시보드</span>
                    <Badge className="bg-green-500 text-white border-0">Live</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm">CTR 향상</span>
                        <span className="text-white font-bold text-xl">+25%</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm">ROI 증대</span>
                        <span className="text-white font-bold text-xl">1.5배</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm">추가 수익</span>
                        <span className="text-white font-bold text-xl">1.25억원</span>
                      </div>
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-bounce">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-pulse">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="gradient-bg text-white border-0 px-4 py-1.5 mb-4">
              핵심 기능
            </Badge>
            <h2 className="text-4xl font-bold mb-4">AI 기반 자동화로 마케팅 의사결정을<br />더 빠르고 정확하게</h2>
            <p className="text-xl text-gray-600">딥러닝 기술과 통계적 검증을 통한 신뢰할 수 있는 인사이트</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-0 shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">AI 자동 분석</CardTitle>
                <CardDescription className="text-base">
                  딥러닝 모델이 수만 건의 데이터를 분석하여 숨겨진 패턴을 발견합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">실시간 데이터 처리</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">패턴 자동 인식</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">예측 모델링</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">통계적 근거</CardTitle>
                <CardDescription className="text-base">
                  p-value, 신뢰구간 등 통계적 검증을 통해 신뢰할 수 있는 인사이트 제공
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">통계적 유의성 검증</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">신뢰구간 분석</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">A/B 테스트 지원</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg">
              <CardHeader>
                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-4">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl">실시간 모니터링</CardTitle>
                <CardDescription className="text-base">
                  모델 성능을 실시간으로 추적하고 이상 징후를 즉시 알림
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">24/7 성능 모니터링</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">자동 알림 시스템</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">이상 징후 탐지</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="gradient-bg text-white border-0 px-4 py-1.5 mb-4">
              주요 서비스
            </Badge>
            <h2 className="text-4xl font-bold mb-4">SK AX을 위한 맞춤형 솔루션</h2>
            <p className="text-xl text-gray-600">비즈니스 성과를 극대화하는 AI 기반 마케팅 플랫폼</p>
          </div>

          <div className="space-y-12">
            {/* Service 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <Badge className="bg-purple-100 text-purple-700 border-0 px-3 py-1">
                    고객사 대시보드
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">클릭 데이터 기반<br />실시간 분석 대시보드</h3>
                <p className="text-lg text-gray-600">
                  웹 페이지의 모든 클릭 이벤트를 수집하고 분석하여 사용자 행동 패턴을 파악합니다. 경로값, 태그 정보, 클릭 순서를 추적하여 마케팅 인사이트를 제공합니다.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">클릭 이벤트 수집 (경로, 태그, 순서)</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">사용자 행동 패턴 분석 & 시각화</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">AI 기반 마케팅 전략 추천</span>
                  </li>
                </ul>
                <Button className="gradient-bg text-white hover:opacity-90">
                  자세히 보기
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg">성과 요약</h4>
                    <Badge className="bg-green-100 text-green-700 border-0">실시간</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">+25%</div>
                      <div className="text-xs text-gray-600 mt-1">CTR 향상</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">1.5배</div>
                      <div className="text-xs text-gray-600 mt-1">ROI 증대</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1.25억</div>
                      <div className="text-xs text-gray-600 mt-1">추가 수익</div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <LineChart className="w-full h-32 text-purple-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl shadow-xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg">AI 생성 보고서</h4>
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">"사용자들이 메인 배너 → 상품 상세 → 구매 버튼 순으로 클릭하는 패턴이 가장 높은 전환율을 보입니다"</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">"특정 경로(/promo)에서 클릭이 집중되며, 해당 태그의 CTR이 35% 높습니다"</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">"추천: 클릭 순서 분석 결과를 바탕으로 랜딩 페이지 구조를 최적화하세요"</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <div className="inline-block">
                  <Badge className="bg-indigo-100 text-indigo-700 border-0 px-3 py-1">
                    AI 보고서
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">AI 모델 기반<br />인사이트 & 전략 추천</h3>
                <p className="text-lg text-gray-600">
                  클릭 데이터를 분석하여 인사이트를 도출하고, 지표 간 관계를 파악하여 최적의 마케팅 전략을 자동으로 추천합니다.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-indigo-600 mr-3" />
                    <span className="text-gray-700">클릭 순서 분석을 통한 사용자 여정 파악</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-indigo-600 mr-3" />
                    <span className="text-gray-700">인사이트 & 지표 관계 분석</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-indigo-600 mr-3" />
                    <span className="text-gray-700">데이터 기반 마케팅 전략 자동 생성</span>
                  </li>
                </ul>
                <Button className="gradient-bg text-white hover:opacity-90">
                  자세히 보기
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Service 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <Badge className="bg-red-100 text-red-700 border-0 px-3 py-1">
                    성능 알림
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold">실시간 성능 모니터링<br />& 자동 알림 시스템</h3>
                <p className="text-lg text-gray-600">
                  모델 성능을 24/7 모니터링하고 이상 징후 발생 시 즉시 알림을 전송하여 신속한 대응이 가능합니다.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-gray-700">Accuracy &lt; 0.7 시 자동 경고</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-gray-700">WebSocket 기반 실시간 푸시</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-gray-700">성능 저하 원인 자동 분석 & 재학습 제안</span>
                  </li>
                </ul>
                <Button className="gradient-bg text-white hover:opacity-90">
                  자세히 보기
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl shadow-xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-100 rounded-full p-2">
                        <Bell className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-red-700 mb-1">성능 경고</h5>
                        <p className="text-sm text-gray-600">모델 정확도가 0.68로 하락했습니다. 재학습을 권장합니다.</p>
                        <p className="text-xs text-gray-400 mt-2">2분 전</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-xl p-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-green-700 mb-1">학습 완료</h5>
                        <p className="text-sm text-gray-600">새로운 모델 학습이 완료되었습니다. Accuracy: 0.875</p>
                        <p className="text-xs text-gray-400 mt-2">1시간 전</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Section */}
      <section id="performance" className="py-20 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="gradient-bg text-white border-0 px-4 py-1.5 mb-4">
              성능 지표
            </Badge>
            <h2 className="text-4xl font-bold mb-4">검증된 성과</h2>
            <p className="text-xl text-gray-600">실제 데이터로 증명된 플랫폼의 우수성</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="card-hover border-0 shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold gradient-text mb-2">87.5%</div>
                <div className="text-gray-600 font-medium">평균 정확도</div>
                <p className="text-sm text-gray-500 mt-2">업계 최고 수준의 예측 정확도</p>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold gradient-text mb-2">&lt;100ms</div>
                <div className="text-gray-600 font-medium">추론 속도</div>
                <p className="text-sm text-gray-500 mt-2">실시간 의사결정 지원</p>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-gray-600 font-medium">가용성</div>
                <p className="text-sm text-gray-500 mt-2">안정적인 서비스 운영</p>
              </CardContent>
            </Card>

            <Card className="card-hover border-0 shadow-lg text-center">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold gradient-text mb-2">+25%</div>
                <div className="text-gray-600 font-medium">ROI 증대</div>
                <p className="text-sm text-gray-500 mt-2">마케팅 투자 효율 극대화</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="gradient-bg text-white border-0 px-4 py-1.5">
                SK AX
              </Badge>
              <h2 className="text-4xl font-bold">AI와 데이터로<br />비즈니스를 혁신합니다</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                SK AX는 SK그룹의 AI/DX 전문 계열사로, 기업의 디지털 전환과 AI 적용을 선도하고 있습니다. 최첨단 AI 기술과 빅데이터 분석 역량을 바탕으로 고객의 비즈니스 성과를 극대화하는 맞춤형 솔루션을 제공합니다.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">AI 프로젝트</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">200+</div>
                  <div className="text-sm text-gray-600">고객사</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">고객 만족도</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-12 text-white">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">AI 기술 전문성</h4>
                    <p className="text-white/80">최신 AI 기술과 딥러닝 모델을 활용한 혁신적인 솔루션</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">고객 중심 접근</h4>
                    <p className="text-white/80">고객의 비즈니스 목표에 최적화된 맞춤형 서비스</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 rounded-lg p-3">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">안정성과 신뢰성</h4>
                    <p className="text-white/80">엔터프라이즈급 인프라와 24/7 운영 지원</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl text-white/90 mb-8">데이터 기반 마케팅 의사결정의 새로운 기준</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
              무료 데모 신청
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 bg-transparent">
              문의하기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold">SK AX</span>
              </div>
              <p className="text-gray-400 text-sm">AI eXcellence, Accelerate Your Future</p>
              <p className="text-gray-400 text-sm mt-4">SK그룹의 AI/DX 전문 계열사</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">CTR AIOps</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI 컨설팅</a></li>
                <li><a href="#" className="hover:text-white transition-colors">MLOps 솔루션</a></li>
                <li><a href="#" className="hover:text-white transition-colors">데이터 분석</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">회사 소개</a></li>
                <li><a href="#" className="hover:text-white transition-colors">사업 영역</a></li>
                <li><a href="#" className="hover:text-white transition-colors">채용</a></li>
                <li><a href="#" className="hover:text-white transition-colors">파트너십</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">문의</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: contact@sk-ax.com</li>
                <li>Tel: 02-6400-0000</li>
                <li>서울특별시 중구 을지로 SK서린빌딩</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 SK AX. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

