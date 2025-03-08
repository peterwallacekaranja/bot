import React, { lazy, Suspense, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import ChunkLoader from '@/components/loader/chunk-loader';
import Tabs from '@/components/shared_ui/tabs/tabs';
import TradingViewModal from '@/components/trading-view-chart/trading-view-modal';
import { DBOT_TABS } from '@/constants/bot-contents';
import { useApiBase } from '@/hooks/useApiBase';
import { useStore } from '@/hooks/useStore';
import { useDevice } from '@deriv-com/ui';
import RunPanel from '../../components/run-panel';
import ChartModal from '../chart/chart-modal';
import Dashboard from '../dashboard';
import RunStrategy from '../dashboard/run-strategy';

const Chart = lazy(() => import('../chart'));
const Tutorial = lazy(() => import('../tutorials'));

const AppWrapper = observer(() => {
    const { connectionStatus } = useApiBase();
    const { dashboard } = useStore();
    const {
        active_tab,
        is_chart_modal_visible,
        is_trading_view_modal_visible,
        setActiveTab,
    } = dashboard;
    const { isDesktop } = useDevice();
    const location = useLocation();
    const navigate = useNavigate();

    const hash = ['dashboard', 'bot_builder', 'chart', 'tutorial', 'analysis_tool', 'free_bots'];
    
    const GetHashedValue = useCallback((tab: number) => {
        let tab_value = location.hash?.split('#')[1];
        return tab_value ? Number(hash.indexOf(String(tab_value))) : tab;
    }, [location.hash]);
    
    const active_hash_tab = GetHashedValue(active_tab);

    useEffect(() => {
        setActiveTab(Number(active_hash_tab));
        navigate(`#${hash[active_hash_tab] || hash[0]}`);
    }, [active_hash_tab, setActiveTab, navigate]);

    const handleTabChange = useCallback((tab_index: number) => {
        setActiveTab(tab_index);
        navigate(`#${hash[tab_index] || hash[0]}`);
    }, [setActiveTab, navigate]);

    return (
        <React.Fragment>
            <div className='main'>
                <div className={classNames('main__container')}>
                    <Tabs
                        active_index={active_tab}
                        className='main__tabs'
                        onTabItemClick={handleTabChange}
                        top
                    >
                        <div label={<><svg width='16' height='16'><circle cx='8' cy='8' r='6' fill='black' /></svg> Dashboard</>} id='id-dbot-dashboard'>
                            <Dashboard handleTabChange={handleTabChange} />
                        </div>
                        <div label={<><svg width='16' height='16'><rect width='12' height='12' x='2' y='2' fill='black' /></svg> Bot Builder</>} id='id-bot-builder' />
                        <div label={<><svg width='16' height='16'><path d='M2 14 L8 2 L14 14 Z' fill='black' /></svg> Charts</>} id={is_chart_modal_visible || is_trading_view_modal_visible ? 'id-charts--disabled' : 'id-charts'}>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading chart...' />}>
                                <Chart show_digits_stats={false} />
                            </Suspense>
                        </div>
                        <div label={<><svg width='16' height='16'><line x1='2' y1='8' x2='14' y2='8' stroke='black' strokeWidth='2' /></svg> Tutorials</>} id='id-tutorials'>
                            <Suspense fallback={<ChunkLoader message='Please wait, loading tutorials...' />}>
                                <Tutorial handleTabChange={handleTabChange} />
                            </Suspense>
                        </div>

                        {/* New Analysis Tool Tab */}
                        <div label={<><svg width='16' height='16'><rect width='12' height='12' x='2' y='2' fill='black' /></svg> Analysis Tool</>} id='id-analysis-tool'>
                            <div className='analysis-tool-wrapper' style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden' }}>
                                <iframe
                                    src='https://your-analysis-tool-url.com'
                                    title='Analysis Tool'
                                    width='100%'
                                    height='100%'
                                    style={{ flexGrow: 1, border: 'none', overflow: 'auto' }}
                                />
                            </div>
                        </div>

                        {/* New Free Bots Tab */}
                        <div label={<><svg width='16' height='16'><polygon points='2,2 14,2 8,14' fill='black' /></svg> Free Bots</>} id='id-free-bots'>
                            <div className='free-bots-wrapper' style={{ padding: '20px' }}>
                                <h2>Free Bots</h2>
                                <p>Browse and download free bot files here.</p>
                                <ul>
                                    <li><a href='#'>Bot Strategy 1</a> - A high-frequency trading bot.</li>
                                    <li><a href='#'>Bot Strategy 2</a> - A trend-following bot.</li>
                                    <li><a href='#'>Bot Strategy 3</a> - A volatility-based trading bot.</li>
                                    <li><a href='#'>Bot Strategy 4</a> - A reversal pattern bot.</li>
                                    <li><a href='#'>Bot Strategy 5</a> - A support and resistance bot.</li>
                                </ul>
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <div className='main__run-strategy-wrapper'>
                <RunStrategy />
                <RunPanel />
            </div>
            <ChartModal />
            <TradingViewModal />
        </React.Fragment>
    );
});

export default AppWrapper;
