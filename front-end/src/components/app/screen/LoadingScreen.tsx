import styleLoadingScreen from '@components/app/screen/LoadingScreen.module.css';

function LoadingScreen(): JSX.Element {
  return (
    <main className="flex items-center justify-center h-screen bg-dark-purple">
      <div className={styleLoadingScreen.style__loader}></div>
    </main>
  );
}

export default LoadingScreen;
