<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export function load({ error, status }) {
		return {
			props: { error, status }
		};
	}
</script>

<script>
	import Head from '$lib/head.svelte';

	/** @type {number} */
	export let status;

	/** @type {Error & {frame?: string} & {loc?: object}} */
	export let error;

	function goBack(e) {
		if (e && window) window.history.back();
	}
</script>

<style>
	.error-accordion {
		position: absolute;
		top: 0;
		width: 100%;
		z-index: 1000;
	}
</style>

<Head title="Addavox | Error"/>
<div class="error-accordion">
{#if error.frame || error.stack}
	<div class="accordion p-4" id="accordionExample">
		{#if error.frame}
		<div class="accordion-item">
			<h2 class="accordion-header" id="headingTwo">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
					Error Frame
				</button>
			</h2>
			<div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
				<div class="accordion-body">
					<pre>{error.frame}</pre>
				</div>
			</div>
		</div>
		{/if}
		{#if error.stack}
		<div class="accordion-item">
			<h2 class="accordion-header" id="headingThree">
				<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
					Stacktrace
				</button>
			</h2>
			<div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
				<div class="accordion-body">
					<pre>{error.stack}</pre>
				</div>
			</div>
		</div>
		{/if}	
	</div>
	{/if}
</div>
<!-- BEGIN #app -->
<div id="app" class="app app-full-height app-without-header p-0">
	<!-- BEGIN error -->
	<div class="error-page pt-0">
		<!-- BEGIN error-page-content -->
		<div class="error-page-content">
			<div class="card mb-5 mx-auto" style="max-width: 320px;">
				<div class="card-body">
					<div class="card">
						<div class="error-code">{status}</div>
						<div class="card-arrow">
							<div class="card-arrow-top-left"></div>
							<div class="card-arrow-top-right"></div>
							<div class="card-arrow-bottom-left"></div>
							<div class="card-arrow-bottom-right"></div>
						</div>
					</div>
				</div>
				<div class="card-arrow">
					<div class="card-arrow-top-left"></div>
					<div class="card-arrow-top-right"></div>
					<div class="card-arrow-bottom-left"></div>
					<div class="card-arrow-bottom-right"></div>
				</div>
			</div>
			<h1>Oops!</h1> 
			<h3>{error.message}</h3>
			<hr />
			<p class="mb-1">
				Here are some helpful links instead:
			</p>
			<p class="mb-5">
				<a href="/" class="text-decoration-none text-white text-opacity-50">Sign In</a>
				<span class="link-divider"></span>
				<a href="/register" class="text-decoration-none text-white text-opacity-50">Register</a>
			</p>
			<a href="#back" on:click={(e) => goBack(e)} class="btn btn-outline-theme px-3 rounded-pill"><i class="fa fa-arrow-left me-1 ms-n1"></i> Go Back</a>
		</div>
		<!-- END error-page-content -->
	</div>
	<!-- END error -->
	
	<!-- BEGIN btn-scroll-top -->
	<a href="#top" data-toggle="scroll-to-top" class="btn-scroll-top fade"><i class="fa fa-arrow-up"></i></a>
	<!-- END btn-scroll-top -->
	
</div>
<!-- END #app -->
